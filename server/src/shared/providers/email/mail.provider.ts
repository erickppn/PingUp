export interface SendMailData {
  to: string,
  subject: string,
  body: string
}

export type SendMail = (data: SendMailData) => Promise<void>