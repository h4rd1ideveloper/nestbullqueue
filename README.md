# 📬 NestBullQueue

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Bull](https://img.shields.io/badge/Bull-ED8B00?style=for-the-badge&logo=javascript&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

Um sistema de filas assíncronas para processamento de e-mails construído com NestJS e Bull. Este projeto demonstra como implementar um sistema de filas robusto para operações de envio de e-mail em segundo plano, melhorando a performance e a confiabilidade de aplicações Node.js.

## 🚀 Funcionalidades

- **Processamento Assíncrono**: Envio de e-mails em segundo plano sem bloquear o thread principal
- **Arquitetura Producer/Consumer**: Separação clara entre produção e consumo de tarefas
- **Retry Automático**: Tentativas automáticas em caso de falhas
- **Monitoramento**: Acompanhamento do status das filas e tarefas
- **Escalabilidade**: Facilmente escalável horizontalmente para lidar com alto volume de e-mails
- **Persistência**: Armazenamento de tarefas em Redis para garantir durabilidade

## 🛠️ Tecnologias

- **Framework**: NestJS
- **Gerenciador de Filas**: Bull (baseado em Redis)
- **Linguagem**: TypeScript
- **Banco de Dados**: Redis (para armazenamento de filas)
- **Envio de E-mail**: Nodemailer

## 📋 Pré-requisitos

- Node.js v14+ instalado
- Redis Server (local ou remoto)
- Conta de e-mail SMTP para testes (ou serviço como SendGrid, Mailgun, etc.)

## 🔧 Instalação e Configuração

1. Clone o repositório:
   ```bash
   git clone https://github.com/h4rd1ideveloper/nestbullqueue.git
   cd nestbullqueue
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

   ```
   # Redis
   REDIS_HOST=localhost
   REDIS_PORT=6379
   
   # Email
   MAIL_HOST=smtp.example.com
   MAIL_PORT=587
   MAIL_USER=your-email@example.com
   MAIL_PASSWORD=your-password
   MAIL_FROM=your-email@example.com
   
   # App
   PORT=3000
   ```

4. Inicie o servidor:
   ```bash
   # Modo de desenvolvimento
   npm run start:dev
   
   # Modo de produção
   npm run build
   npm run start:prod
   ```

## 📚 Arquitetura

O projeto segue uma arquitetura de filas baseada no padrão Producer/Consumer:

### Producer (Produtor)

O serviço `SendMailProducerService` é responsável por adicionar tarefas à fila. Ele recebe os dados do e-mail e os envia para processamento assíncrono.

```typescript
// Exemplo de uso do Producer
@Injectable()
export class AppService {
  constructor(private sendMailProducer: SendMailProducerService) {}

  async sendWelcomeEmail(user: User) {
    await this.sendMailProducer.sendMail({
      to: user.email,
      subject: 'Bem-vindo ao nosso serviço!',
      template: 'welcome',
      context: {
        name: user.name,
      },
    });
    
    return { message: 'E-mail adicionado à fila com sucesso!' };
  }
}
```

### Consumer (Consumidor)

O `SendMailConsumer` processa as tarefas da fila, realizando o envio efetivo dos e-mails.

```typescript
// Estrutura do Consumer
@Processor('send-mail-queue')
export class SendMailConsumer {
  @Process('send-mail-job')
  async sendMailJob(job: Job<SendMailDto>) {
    const { data } = job;
    // Lógica de envio de e-mail
    // ...
    return { success: true };
  }
}
```

## 📝 Exemplos de Uso

### Adicionando um E-mail à Fila

```typescript
// Em qualquer serviço da aplicação
import { SendMailProducerService } from './jobs/sendMailProducerService';

@Injectable()
export class UserService {
  constructor(private sendMailProducer: SendMailProducerService) {}

  async createUser(userData: CreateUserDto) {
    // Lógica para criar usuário
    const user = await this.userRepository.create(userData);
    
    // Adiciona e-mail de boas-vindas à fila
    await this.sendMailProducer.sendMail({
      to: user.email,
      subject: 'Conta criada com sucesso!',
      text: `Olá ${user.name}, sua conta foi criada com sucesso!`,
      html: `<p>Olá <strong>${user.name}</strong>, sua conta foi criada com sucesso!</p>`,
    });
    
    return user;
  }
}
```

### Configurando o Módulo Bull

```typescript
// Em app.module.ts
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'send-mail-queue',
    }),
    // Outros módulos
  ],
  // ...
})
export class AppModule {}
```

## 🔄 Monitoramento e Gerenciamento

Para monitorar e gerenciar suas filas, você pode usar:

1. **Bull Board**: Uma interface web para monitoramento de filas Bull
   ```bash
   npm install @bull-board/express @bull-board/api
   ```

2. **Logs Personalizados**: Implemente logs nos eventos de fila
   ```typescript
   @OnQueueActive()
   onActive(job: Job) {
     console.log(`Processando job ${job.id} do tipo ${job.name}...`);
   }
   
   @OnQueueCompleted()
   onComplete(job: Job, result: any) {
     console.log(`Job ${job.id} concluído com resultado:`, result);
   }
   
   @OnQueueFailed()
   onError(job: Job, error: any) {
     console.error(`Job ${job.id} falhou com erro:`, error);
   }
   ```

## 🔍 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

## 📈 Escalabilidade

Para escalar horizontalmente:

1. **Múltiplos Workers**: Inicie várias instâncias da aplicação
2. **Concorrência**: Configure o nível de concorrência nos consumidores
   ```typescript
   @Processor('send-mail-queue', {
     concurrency: 5, // Processa até 5 jobs simultaneamente
   })
   export class SendMailConsumer {
     // ...
   }
   ```

## 🔒 Segurança

- Armazene credenciais sensíveis apenas no arquivo `.env` (não incluso no controle de versão)
- Use variáveis de ambiente para configurações de produção
- Considere usar serviços gerenciados como AWS SES para envio de e-mails em produção

## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## 👨‍💻 Autor

Desenvolvido por [Yan Policarpo](https://github.com/h4rd1ideveloper).

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no GitHub!
