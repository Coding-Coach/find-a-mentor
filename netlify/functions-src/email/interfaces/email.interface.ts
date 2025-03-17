export interface EmailParams {
  to: string
  subject: string
  data?: Record<string, any>
  name: string
}

export interface SendData<TemplateParams> {
  to: string
  from?: string
  subject: string
  html: string
  templateId?: string
  dynamic_template_data?: TemplateParams
}

export enum Template {
  USER_DELETED = 'd-1234567890abcdef1234567890abcdef',
}
