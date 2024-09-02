const { defaultProvider } = require('@aws-sdk/credential-provider-node'); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const domain = process.env.domain;

const client = new Client({
    ...AwsSigv4Signer({
      region: 'us-east-1',
      service: 'es',  // 'aoss' for OpenSearch Serverless
  
      // Example with AWS SDK V3:
      getCredentials: () => {
        // Any other method to acquire a new Credentials object can be used.
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    }),
    node: domain, // OpenSearch domain URL
  });


exports.handler = async event => {
    const region = process.env.REGION;
    const bucket = process.env.BUCKET;
    const role = process.env.ROLE;
    console.log("Region", region);
    console.log("Bucket", bucket);
    console.log("Role", role);

    const settings = {bucket, role_arn: role}
    console.log('START: Ensuring S3 Repository', settings);
   const repositoryResponse = await client.snapshot.createRepository({repository: bucket, body: {settings, type: "s3"}})
    console.log('SUCCESS: Ensuring S3 Repository', repositoryResponse);
   
   const indices = event.indices;
    const snapshotSettings = {body:{indices}, repository: bucket, snapshot: "snapshot4"};
    console.log('START: Snapshot', snapshotSettings);
    const snapshotRepsonse = await client.snapshot.create(snapshotSettings);
    console.log('SUCCESS: Snapshot', snapshotRepsonse);
};
