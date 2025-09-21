# 🚀 Kalpla Platform - Complete Hosting & Deployment Guide

## Overview

This comprehensive guide covers all hosting options and deployment strategies for the Kalpla EdTech platform, from development to production environments.

## 🏗️ Architecture Summary

**Kalpla Platform Stack:**
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: AWS Amplify (Serverless)
- **Database**: DynamoDB + Aurora Serverless
- **Storage**: S3 + CloudFront CDN
- **Authentication**: AWS Cognito
- **API**: AppSync (GraphQL) + API Gateway (REST)
- **Functions**: AWS Lambda
- **Video**: MediaConvert + IVS + CloudFront
- **Payments**: PayU Gateway
- **Monitoring**: CloudWatch

## 🎯 Recommended Hosting Strategy

### **Primary Recommendation: AWS Amplify (Full-Stack)**

**Why AWS Amplify?**
- ✅ **Native Integration**: Built specifically for Next.js + AWS services
- ✅ **Serverless**: Auto-scaling, pay-per-use
- ✅ **Global CDN**: CloudFront integration out-of-the-box
- ✅ **CI/CD**: Automatic deployments from Git
- ✅ **Security**: Built-in SSL, DDoS protection
- ✅ **Cost-Effective**: Pay only for what you use

## 🌐 Hosting Options Comparison

### 1. **AWS Amplify (Recommended)**

#### **Pros:**
- Native AWS integration
- Automatic scaling
- Built-in CI/CD
- Global CDN
- SSL certificates
- DDoS protection
- Cost-effective for startups

#### **Cons:**
- Vendor lock-in to AWS
- Learning curve for AWS services
- Limited customization options

#### **Cost Estimate:**
- **Development**: $50-100/month
- **Production**: $200-500/month
- **Enterprise**: $500-2000/month

#### **Deployment Steps:**
```bash
# 1. Initialize Amplify
amplify init

# 2. Add services
amplify add auth
amplify add api
amplify add storage
amplify add function

# 3. Deploy
amplify push
amplify publish
```

### 2. **Vercel + AWS Backend**

#### **Pros:**
- Excellent Next.js integration
- Global edge network
- Easy deployments
- Great developer experience
- Automatic HTTPS

#### **Cons:**
- Separate backend management
- Higher costs for video streaming
- Limited serverless functions

#### **Cost Estimate:**
- **Development**: $20-50/month
- **Production**: $100-300/month
- **Enterprise**: $400-1000/month

#### **Deployment Steps:**
```bash
# 1. Deploy to Vercel
vercel --prod

# 2. Configure AWS backend separately
aws cloudformation create-stack --stack-name kalpla-backend
```

### 3. **Netlify + AWS Backend**

#### **Pros:**
- Easy deployments
- Good Next.js support
- Built-in forms handling
- Edge functions

#### **Cons:**
- Limited serverless functions
- Higher costs for video
- Separate backend management

#### **Cost Estimate:**
- **Development**: $19-50/month
- **Production**: $99-300/month
- **Enterprise**: $500-1500/month

### 4. **Self-Hosted (VPS/Cloud)**

#### **Pros:**
- Full control
- Lower costs for high traffic
- Custom configurations
- No vendor lock-in

#### **Cons:**
- Complex setup
- Security management
- Scaling challenges
- Maintenance overhead

#### **Cost Estimate:**
- **Development**: $20-50/month
- **Production**: $100-500/month
- **Enterprise**: $500-2000/month

## 🚀 Step-by-Step Deployment Guide

### **Option 1: AWS Amplify (Recommended)**

#### **Phase 1: Prerequisites**

1. **AWS Account Setup**
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   
   # Configure AWS CLI
   aws configure
   # Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
   ```

2. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

3. **Domain Setup**
   - Purchase domain (e.g., kalpla.com)
   - Configure DNS settings
   - Request SSL certificate from AWS ACM

#### **Phase 2: Backend Deployment**

1. **Initialize Amplify Project**
   ```bash
   cd kalpla-platform
   amplify init
   
   # Follow prompts:
   # - Project name: kalpla-platform
   # - Environment: dev
   # - Default editor: Visual Studio Code
   # - App type: javascript
   # - Framework: react
   # - Source directory: src
   # - Distribution directory: out
   # - Build command: npm run build
   # - Start command: npm run start
   ```

2. **Add Authentication**
   ```bash
   amplify add auth
   
   # Configuration:
   # - Default configuration with Social Provider (Federated)
   # - User Pool name: KalplaUserPool
   # - Identity Pool name: KalplaIdentityPool
   # - Username attributes: Email
   # - Required attributes: Email, Name
   # - Password requirements: 8+ characters, uppercase, lowercase, numbers, symbols
   # - MFA: Optional (SMS and TOTP)
   # - Social providers: Google
   ```

3. **Add GraphQL API**
   ```bash
   amplify add api
   
   # Configuration:
   # - GraphQL
   # - API name: kalpla
   # - Authorization: Amazon Cognito User Pool
   # - Additional auth types: IAM
   # - Conflict resolution: Auto Merge
   ```

4. **Add Storage**
   ```bash
   amplify add storage
   
   # Configuration:
   # - Content (Images, audio, video, etc.)
   # - Bucket name: kalpla-storage
   # - Access: Auth users only
   # - Auth permissions: Create/Update, Read, Delete
   ```

5. **Add Lambda Functions**
   ```bash
   # Payment Processor
   amplify add function
   # Function name: paymentProcessor
   # Runtime: Node.js 18.x
   
   # Payment Webhook
   amplify add function
   # Function name: paymentWebhook
   # Runtime: Node.js 18.x
   
   # Analytics Processor
   amplify add function
   # Function name: analyticsProcessor
   # Runtime: Node.js 18.x
   ```

6. **Deploy Backend**
   ```bash
   amplify push
   ```

#### **Phase 3: Frontend Deployment**

1. **Configure Environment Variables**
   ```bash
   # Create .env.local
   cat > .env.local << EOF
   # AWS Configuration
   AWS_REGION=us-east-1
   NEXT_PUBLIC_AWS_REGION=us-east-1
   
   # PayU Configuration
   PAYU_MERCHANT_ID=your-merchant-id
   PAYU_MERCHANT_KEY=your-merchant-key
   PAYU_MERCHANT_SALT=your-merchant-salt
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Application URLs
   NEXT_PUBLIC_APP_URL=https://kalpla.com
   NEXT_PUBLIC_API_URL=https://api.kalpla.com
   EOF
   ```

2. **Build and Deploy**
   ```bash
   # Build the application
   npm run build
   
   # Deploy to Amplify
   amplify publish
   ```

3. **Configure Custom Domain**
   ```bash
   # Add custom domain
   amplify add hosting
   
   # Configure domain
   amplify configure hosting
   ```

#### **Phase 4: Production Setup**

1. **Set up Production Environment**
   ```bash
   # Create production environment
   amplify env add prod
   
   # Switch to production
   amplify env checkout prod
   
   # Deploy production
   amplify push
   ```

2. **Configure Monitoring**
   ```bash
   # Add CloudWatch monitoring
   amplify add monitoring
   
   # Configure alerts
   amplify configure monitoring
   ```

3. **Set up CI/CD**
   ```bash
   # Connect to Git repository
   amplify add hosting
   
   # Configure automatic deployments
   amplify configure hosting
   ```

### **Option 2: Vercel + AWS Backend**

#### **Phase 1: Vercel Deployment**

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**
   ```bash
   # Set environment variables in Vercel dashboard
   vercel env add NEXT_PUBLIC_AWS_REGION
   vercel env add PAYU_MERCHANT_ID
   vercel env add GOOGLE_CLIENT_ID
   ```

#### **Phase 2: AWS Backend Setup**

1. **Deploy AWS Resources**
   ```bash
   # Deploy CloudFormation stack
   aws cloudformation create-stack \
     --stack-name kalpla-backend \
     --template-body file://amplify/backend/kalpla-infrastructure.yaml \
     --capabilities CAPABILITY_IAM
   ```

2. **Configure API Gateway**
   ```bash
   # Set up API Gateway
   aws apigateway create-rest-api --name kalpla-api
   ```

### **Option 3: Self-Hosted (VPS)**

#### **Phase 1: Server Setup**

1. **Choose VPS Provider**
   - **DigitalOcean**: $20-100/month
   - **Linode**: $20-100/month
   - **AWS EC2**: $30-150/month
   - **Google Cloud**: $30-150/month

2. **Server Configuration**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/kalpla-platform.git
   cd kalpla-platform
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "kalpla" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx**
   ```bash
   # Create Nginx configuration
   sudo nano /etc/nginx/sites-available/kalpla
   
   # Add configuration
   server {
       listen 80;
       server_name kalpla.com www.kalpla.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   
   # Enable site
   sudo ln -s /etc/nginx/sites-available/kalpla /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

5. **SSL Certificate**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx -y
   
   # Get SSL certificate
   sudo certbot --nginx -d kalpla.com -d www.kalpla.com
   ```

## 💰 Cost Analysis

### **AWS Amplify (Recommended)**

| Component | Development | Production | Enterprise |
|-----------|-------------|------------|------------|
| **Frontend Hosting** | $0-20 | $20-50 | $50-100 |
| **Backend Services** | $30-50 | $100-200 | $300-500 |
| **Database** | $10-20 | $50-100 | $100-200 |
| **Storage** | $5-10 | $20-50 | $50-100 |
| **CDN** | $5-10 | $20-50 | $50-100 |
| **Functions** | $5-10 | $20-50 | $50-100 |
| **Total** | **$55-120** | **$230-500** | **$600-1100** |

### **Vercel + AWS Backend**

| Component | Development | Production | Enterprise |
|-----------|-------------|------------|------------|
| **Vercel Hosting** | $20 | $100 | $400 |
| **AWS Backend** | $30-50 | $100-200 | $300-500 |
| **Total** | **$50-70** | **$200-300** | **$700-900** |

### **Self-Hosted**

| Component | Development | Production | Enterprise |
|-----------|-------------|------------|------------|
| **VPS** | $20-50 | $100-200 | $500-1000 |
| **AWS Backend** | $30-50 | $100-200 | $300-500 |
| **Maintenance** | $0 | $50-100 | $200-500 |
| **Total** | **$50-100** | **$250-500** | **$1000-2000** |

## 🔧 Configuration Files

### **Amplify Configuration**

```bash
# amplify/backend/awscloudformation/parameters.json
{
  "authSelections": "identityPoolAndUserPool",
  "autoVerifiedAttributes": ["email", "phone_number"],
  "mfaConfiguration": "OPTIONAL",
  "mfaTypes": ["SMS", "TOTP"],
  "requiredAttributes": ["email", "name"],
  "aliasAttributes": ["email", "phone_number"],
  "userpoolClientGenerateSecret": false,
  "userpoolClientRefreshTokenValidity": 30,
  "userpoolClientWriteAttributes": ["email", "name", "phone_number"],
  "userpoolClientReadAttributes": ["email", "name", "phone_number"],
  "userpoolClientSetAttributes": true,
  "hostedUI": true,
  "hostedUIDomainName": "kalpla-auth",
  "authProviders": ["Google"],
  "callbackURLs": ["https://kalpla.com/auth/callback"],
  "logoutURLs": ["https://kalpla.com/auth/signin"]
}
```

### **Environment Variables**

```bash
# .env.local
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# PayU Configuration
PAYU_MERCHANT_ID=your-merchant-id
PAYU_MERCHANT_KEY=your-merchant-key
PAYU_MERCHANT_SALT=your-merchant-salt

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Application URLs
NEXT_PUBLIC_APP_URL=https://kalpla.com
NEXT_PUBLIC_API_URL=https://api.kalpla.com
```

## 🚨 Security Considerations

### **1. SSL/TLS Configuration**
- Enable HTTPS everywhere
- Use HSTS headers
- Configure secure cookies
- Implement CSP headers

### **2. AWS Security**
- Use IAM roles instead of access keys
- Enable MFA for all accounts
- Use AWS Secrets Manager
- Implement least privilege principle

### **3. Application Security**
- Validate all inputs
- Use parameterized queries
- Implement rate limiting
- Regular security audits

## 📊 Monitoring & Analytics

### **1. AWS CloudWatch**
- Monitor Lambda functions
- Track API Gateway metrics
- Set up alarms and notifications
- Log analysis and debugging

### **2. Application Monitoring**
- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Business metrics

### **3. Cost Monitoring**
- AWS Cost Explorer
- Budget alerts
- Resource optimization
- Regular cost reviews

## 🔄 CI/CD Pipeline

### **AWS Amplify CI/CD**

```yaml
# amplify.yml
version: 1
backend:
  phases:
    build:
      commands:
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: out
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### **GitHub Actions**

```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS Amplify
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to Amplify
        run: amplify publish
```

## 🎯 Deployment Checklist

### **Pre-Deployment**
- [ ] All environment variables configured
- [ ] AWS credentials set up
- [ ] Domain purchased and configured
- [ ] SSL certificate requested
- [ ] PayU account set up
- [ ] Google OAuth configured
- [ ] Database schema deployed
- [ ] Lambda functions tested

### **Deployment**
- [ ] Backend services deployed
- [ ] Frontend application built
- [ ] CDN configured
- [ ] DNS records updated
- [ ] SSL certificate installed
- [ ] Monitoring set up
- [ ] Backup strategy implemented

### **Post-Deployment**
- [ ] Application tested
- [ ] Performance monitored
- [ ] Security scan completed
- [ ] Documentation updated
- [ ] Team trained on deployment
- [ ] Support processes established

## 📞 Support & Maintenance

### **1. Monitoring**
- Set up CloudWatch alarms
- Monitor application performance
- Track user engagement
- Monitor costs

### **2. Updates**
- Regular security updates
- Feature releases
- Bug fixes
- Performance optimizations

### **3. Backup**
- Database backups
- Code repository backups
- Configuration backups
- Disaster recovery plan

## 🚀 Quick Start Commands

```bash
# 1. Clone and setup
git clone https://github.com/your-username/kalpla-platform.git
cd kalpla-platform
npm install

# 2. Configure AWS
aws configure
amplify configure

# 3. Initialize Amplify
amplify init

# 4. Add services
amplify add auth
amplify add api
amplify add storage
amplify add function

# 5. Deploy
amplify push
amplify publish

# 6. Configure domain
amplify add hosting
amplify configure hosting
```

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [AWS CloudFormation Templates](https://docs.aws.amazon.com/cloudformation/)
- [PayU Integration Guide](https://payu.in/docs/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

**Recommendation**: Start with **AWS Amplify** for the easiest deployment and best integration with your existing AWS services. It provides the most comprehensive solution with minimal configuration overhead.
