export type AmplifyDependentResourcesAttributes = {
  "api": {
    "kalpla": {
      "GraphQLAPIEndpointOutput": "string",
      "GraphQLAPIIdOutput": "string",
      "GraphQLAPIKeyOutput": "string"
    }
  },
  "auth": {
    "kalplaAuth": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "storage": {
    "kalplaDocuments": {
      "BucketArn": "string",
      "BucketName": "string"
    },
    "kalplaStorage": {
      "BucketArn": "string",
      "BucketName": "string"
    },
    "kalplaVideos": {
      "BucketArn": "string",
      "BucketName": "string"
    }
  }
}