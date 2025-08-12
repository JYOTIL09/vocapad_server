import { Resend } from 'resend';
import { Email } from './email';

const resend = new Resend('re_123456789');

await resend.emails.send({
    from: 'jyotil.kathiriya@gmail.com',
    to: 'jigarkathiriya815@gmail.com',
    subject: 'hello world',
    react: <Email url="https://example.com" />,
});