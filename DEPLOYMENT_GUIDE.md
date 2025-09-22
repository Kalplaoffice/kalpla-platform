# Kalpla Platform - AWS Deployment Guide

## 🚀 Your Website is Ready for Deployment!

Your Kalpla platform is now configured and ready to be hosted on AWS. Here's everything you need to know:

## 📋 Current Status

✅ **AWS Amplify Backend**: Fully configured and deployed  
✅ **Next.js Application**: Built successfully  
✅ **Git Repository**: Committed and ready  
✅ **Amplify Configuration**: `amplify.yml` created  
✅ **AWS Credentials**: Configured and working  

## 🌐 Deployment Options

### Option 1: AWS Amplify Console (Recommended)

**Your Amplify App ID**: `d198lpm4y4jfjq`  
**Region**: `ap-south-1`  
**Console URL**: https://ap-south-1.console.aws.amazon.com/amplify/home?region=ap-south-1#/d198lpm4y4jfjq/YmFja2VuZA/dev

#### Steps to Deploy:

1. **Open AWS Amplify Console**
   - Go to: https://ap-south-1.console.aws.amazon.com/amplify/home?region=ap-south-1
   - Find your app: `kalpla-platform`

2. **Connect Repository**
   - Click "Connect repository"
   - Choose your Git provider (GitHub, GitLab, Bitbucket, or CodeCommit)
   - Select your repository
   - Choose the branch (main)

3. **Configure Build Settings**
   - Amplify will auto-detect your `amplify.yml` file
   - Review the build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm ci
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: .next
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
           - .next/cache/**/*
     ```

4. **Deploy**
   - Click "Save and deploy"
   - Wait for the build to complete (5-10 minutes)
   - Your website will be live at: `https://main.d198lpm4y4jfjq.amplifyapp.com`

### Option 2: Manual Deployment via CLI

If you prefer CLI deployment:

```bash
# Navigate to your project
cd /Users/jnaneshshetty/Documents/Kalpla-final/kalpla-platform

# Add hosting (interactive)
npx @aws-amplify/cli@latest add hosting

# Deploy
npx @aws-amplify/cli@latest publish
```

## 🔧 Environment Variables

Your application will automatically use the AWS Amplify environment variables:
- **GraphQL API**: `https://byvfvux4hrbjfdrork2awunxem.appsync-api.ap-south-1.amazonaws.com/graphql`
- **Authentication**: Cognito User Pool configured
- **Storage**: S3 buckets for videos, documents, and general storage

## 🌍 Custom Domain Setup

To use your own domain (e.g., `kalpla.com`):

1. **In Amplify Console**:
   - Go to "Domain management"
   - Click "Add domain"
   - Enter your domain name
   - Follow DNS configuration instructions

2. **DNS Configuration**:
   - Add CNAME record pointing to your Amplify app
   - Example: `www.kalpla.com` → `main.d198lpm4y4jfjq.amplifyapp.com`

## 📊 Monitoring & Analytics

- **Amplify Console**: Monitor deployments, build logs, and performance
- **CloudWatch**: View Lambda function logs and metrics
- **AppSync**: Monitor GraphQL API usage

## 🔐 Security Features

Your application includes:
- ✅ **Authentication**: AWS Cognito with Google OAuth
- ✅ **Authorization**: Role-based access control
- ✅ **API Security**: GraphQL with Cognito integration
- ✅ **Storage Security**: S3 with proper IAM policies
- ✅ **HTTPS**: Automatic SSL certificates

## 💰 Cost Estimation

**AWS Amplify Hosting**:
- Free tier: 1,000 build minutes/month
- Additional: $0.01 per build minute

**Other Services** (already configured):
- Cognito: Free for up to 50,000 monthly active users
- AppSync: Free for up to 250,000 requests/month
- S3: Pay per storage and requests
- Lambda: Pay per execution

## 🚀 Next Steps

1. **Deploy via Amplify Console** (recommended)
2. **Test your live website**
3. **Configure custom domain** (optional)
4. **Set up monitoring alerts**
5. **Configure CI/CD** for automatic deployments

## 📞 Support

- **AWS Amplify Documentation**: https://docs.amplify.aws/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **AWS Support**: Available through AWS Console

## 🎉 Success!

Your Kalpla platform is now ready to go live! The deployment process should take about 10-15 minutes, and you'll have a fully functional, scalable web application hosted on AWS.

---

**Deployment URL**: Will be available after deployment  
**Admin Access**: Use your configured Cognito users  
**Backend Services**: All Lambda functions and APIs are already deployed and working
