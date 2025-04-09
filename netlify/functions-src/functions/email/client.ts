import { promises } from 'fs';
import path from 'path';
import { compile } from 'ejs';
import type { EmailParams } from './interfaces/email.interface';
import { sendEmail } from './sendgrid';

export const send = async (params: EmailParams) => {
  const { to, subject, data = {}, name } = params;

  const content = await injectData(name, data);
  try {
    return sendEmail({
      to: to as string,
      subject,
      html: content,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Send email error', params, JSON.stringify(error, null, 2));
    throw new Error('Failed to send email');
  }
}

const injectData = async (name: string, data: Record<string, string>) => {
  const template = await getTemplateContent(name);
  const layout = await getLayout();
  const content = compile(template)(data);
  return compile(layout)({ content });
}

const getLayout = async () => {
  return getTemplateContent('layout');
}

const getTemplateContent = (name: string) => {
  const templatesDir = path.resolve(__dirname, 'email/templates');
  const templatePath = `${templatesDir}/${name}.html`;
  return promises.readFile(templatePath, {
    encoding: 'utf8',
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Error reading template file:', error);
    throw new Error(`Template file not found: ${templatePath}`);
  });
}