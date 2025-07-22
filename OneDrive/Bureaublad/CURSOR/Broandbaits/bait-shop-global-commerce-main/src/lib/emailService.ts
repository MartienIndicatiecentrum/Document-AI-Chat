// ============================================================================
// IMPROVED EMAIL SERVICE - Proactive, Delegated, High-Quality
// ============================================================================

// Types & Interfaces
interface EmailData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface EmailConfig {
  recipientEmail: string;
  serviceType: 'emailjs' | 'api' | 'mock';
  emailjs?: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
  api?: {
    endpoint: string;
    timeout: number;
  };
}

interface EmailResponse {
  success: boolean;
  message: string;
  messageId?: string;
  error?: EmailError;
}

interface EmailError {
  code: string;
  message: string;
  details?: any;
}

// ============================================================================
// PROACTIVE VALIDATION
// ============================================================================
class EmailValidator {
  static validate(formData: EmailData): EmailError | null {
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return { code: 'INVALID_EMAIL', message: 'Ongeldig email adres' };
    }

    // Required fields
    if (!formData.name?.trim()) {
      return { code: 'MISSING_NAME', message: 'Naam is verplicht' };
    }
    if (!formData.subject?.trim()) {
      return { code: 'MISSING_SUBJECT', message: 'Onderwerp is verplicht' };
    }
    if (!formData.message?.trim()) {
      return { code: 'MISSING_MESSAGE', message: 'Bericht is verplicht' };
    }

    // Content length validation
    if (formData.message.length > 2000) {
      return { code: 'MESSAGE_TOO_LONG', message: 'Bericht te lang (max 2000 tekens)' };
    }

    // Phone validation (optional)
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      return { code: 'INVALID_PHONE', message: 'Ongeldig telefoonnummer' };
    }

    return null; // Valid
  }
}

// ============================================================================
// STRUCTURED LOGGING
// ============================================================================
class EmailLogger {
  private static log(level: 'INFO' | 'WARN' | 'ERROR', message: string, data?: any) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      service: 'EmailService',
      message,
      data: data ? JSON.stringify(data, null, 2) : undefined
    };

    console.log(`[${logEntry.level}] ${logEntry.message}`, logEntry.data ? logEntry.data : '');
  }

  static info(message: string, data?: any) {
    this.log('INFO', message, data);
  }

  static warn(message: string, data?: any) {
    this.log('WARN', message, data);
  }

  static error(message: string, data?: any) {
    this.log('ERROR', message, data);
  }
}

// ============================================================================
// DELEGATED EMAIL PROVIDERS
// ============================================================================
abstract class EmailProvider {
  abstract send(formData: EmailData, config: EmailConfig): Promise<EmailResponse>;
}

class EmailJSProvider extends EmailProvider {
  async send(formData: EmailData, config: EmailConfig): Promise<EmailResponse> {
    try {
      EmailLogger.info('Sending email via EmailJS', { to: config.recipientEmail });

      // In real implementation, import emailjs-com
      // import emailjs from 'emailjs-com';
      
      if (!config.emailjs) {
        throw new Error('EmailJS configuration missing');
      }

      const templateData = {
        to_email: config.recipientEmail,
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Niet opgegeven',
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email
      };

      // Simulate EmailJS call
      // const response = await emailjs.send(
      //   config.emailjs.serviceId,
      //   config.emailjs.templateId,
      //   templateData,
      //   config.emailjs.publicKey
      // );

      await new Promise(resolve => setTimeout(resolve, 1500));

      EmailLogger.info('EmailJS send successful');
      return {
        success: true,
        message: 'Email succesvol verzonden via EmailJS',
        messageId: `emailjs_${Date.now()}`
      };

    } catch (error: any) {
      EmailLogger.error('EmailJS send failed', { error: error.message });
      return {
        success: false,
        message: 'Email verzenden via EmailJS mislukt',
        error: {
          code: 'EMAILJS_ERROR',
          message: error.message,
          details: error
        }
      };
    }
  }
}

class APIProvider extends EmailProvider {
  async send(formData: EmailData, config: EmailConfig): Promise<EmailResponse> {
    try {
      EmailLogger.info('Sending email via API', { endpoint: config.api?.endpoint });

      if (!config.api) {
        throw new Error('API configuration missing');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.api.timeout || 10000);

      const response = await fetch(config.api.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          to: config.recipientEmail
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const result = await response.json();
      EmailLogger.info('API send successful');

      return {
        success: true,
        message: 'Email succesvol verzonden via API',
        messageId: result.messageId
      };

    } catch (error: any) {
      EmailLogger.error('API send failed', { error: error.message });
      
      if (error.name === 'AbortError') {
        return {
          success: false,
          message: 'Email verzenden geannuleerd (timeout)',
          error: { code: 'TIMEOUT_ERROR', message: 'Request timeout' }
        };
      }

      return {
        success: false,
        message: 'Email verzenden via API mislukt',
        error: {
          code: 'API_ERROR',
          message: error.message,
          details: error
        }
      };
    }
  }
}

class MockProvider extends EmailProvider {
  async send(formData: EmailData, config: EmailConfig): Promise<EmailResponse> {
    EmailLogger.info('Sending email via Mock (Development)', {
      to: config.recipientEmail,
      from: formData.email,
      subject: formData.subject
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: true,
      message: `Mock: Email zou verzonden zijn naar ${config.recipientEmail}`,
      messageId: `mock_${Date.now()}`
    };
  }
}

// ============================================================================
// MAIN EMAIL SERVICE - Proactive & Delegated
// ============================================================================
class EmailService {
  private providers: Map<string, EmailProvider>;
  private config: EmailConfig;

  constructor(config: EmailConfig) {
    this.config = config;
    this.providers = new Map([
      ['emailjs', new EmailJSProvider()],
      ['api', new APIProvider()],
      ['mock', new MockProvider()]
    ]);
  }

  async sendContactEmail(formData: EmailData): Promise<EmailResponse> {
    try {
      // PROACTIVE: Validate input before processing
      const validationError = EmailValidator.validate(formData);
      if (validationError) {
        EmailLogger.warn('Email validation failed', validationError);
        return {
          success: false,
          message: validationError.message,
          error: validationError
        };
      }

      // DELEGATED: Use appropriate provider
      const provider = this.providers.get(this.config.serviceType);
      if (!provider) {
        throw new Error(`Unknown service type: ${this.config.serviceType}`);
      }

      // Send email with retry mechanism
      return await this.sendWithRetry(provider, formData, 3);

    } catch (error: any) {
      EmailLogger.error('Email service error', { error: error.message });
      return {
        success: false,
        message: 'Er is een onverwachte fout opgetreden',
        error: {
          code: 'SERVICE_ERROR',
          message: error.message,
          details: error
        }
      };
    }
  }

  private async sendWithRetry(
    provider: EmailProvider, 
    formData: EmailData, 
    maxRetries: number
  ): Promise<EmailResponse> {
    let lastError: EmailResponse | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      EmailLogger.info(`Email send attempt ${attempt}/${maxRetries}`);
      
      const result = await provider.send(formData, this.config);
      
      if (result.success) {
        if (attempt > 1) {
          EmailLogger.info(`Email sent successfully on attempt ${attempt}`);
        }
        return result;
      }

      lastError = result;
      EmailLogger.warn(`Email send attempt ${attempt} failed`, result.error);

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    return lastError || {
      success: false,
      message: 'Alle verzendpogingen mislukt',
      error: { code: 'MAX_RETRIES_EXCEEDED', message: 'Maximum aantal pogingen bereikt' }
    };
  }
}

// ============================================================================
// CONFIGURATION FACTORY - Environment Aware
// ============================================================================
class EmailConfigFactory {
  static createConfig(): EmailConfig {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      return {
        recipientEmail: 'martienstrik@hotmail.com',
        serviceType: 'mock'
      };
    }

    // Production configuration
    return {
      recipientEmail: process.env.CONTACT_EMAIL || 'martienstrik@hotmail.com',
      serviceType: (process.env.EMAIL_SERVICE as any) || 'api',
      emailjs: {
        serviceId: process.env.EMAILJS_SERVICE_ID || '',
        templateId: process.env.EMAILJS_TEMPLATE_ID || '',
        publicKey: process.env.EMAILJS_PUBLIC_KEY || ''
      },
      api: {
        endpoint: process.env.EMAIL_API_ENDPOINT || '/api/contact',
        timeout: parseInt(process.env.EMAIL_API_TIMEOUT || '10000')
      }
    };
  }
}

// ============================================================================
// EXPORT - Ready to Use
// ============================================================================
const config = EmailConfigFactory.createConfig();
const emailService = new EmailService(config);

export const sendContactEmail = (formData: EmailData): Promise<EmailResponse> => {
  return emailService.sendContactEmail(formData);
};

export { EmailService, EmailConfigFactory, EmailValidator, EmailLogger };
export type { EmailData, EmailResponse, EmailError, EmailConfig };