package com.gokin.authservice.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.MailSendException;

@Service
public class EmailService {
    @Value("${spring.mail.username}")
    private String username;

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendPasswordResetEmail(String to, String resetLink) throws MailSendException {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(username);
            helper.setTo(to);
            helper.setSubject("Сброс пароля");

            String htmlContent = "<html><body>" +
                    "<p>Здравствуйте!</p>" +
                    "<p>Вы запросили сброс пароля на сайте <strong>Gokin</strong> – вашем путеводителе в мире кино.</p>" +
                    "<p>Чтобы установить новый пароль, пожалуйста, перейдите по ссылке ниже:</p>" +
                    "<p><a href=\"" + resetLink + "\" style=\"color: blue; text-decoration: underline;\">Сбросить пароль</a></p>" +
                    "<p>Если вы не запрашивали смену пароля, просто проигнорируйте это письмо.</p>" +
                    "<hr>" +
                    "<p><em>Gokin – все о кино: новости, обзоры, рейтинги и интересные факты!</em></p>" +
                    "</body></html>";

            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new MailSendException("Ошибка при отправке письма", e);
        }
    }
}