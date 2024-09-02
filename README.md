# lambda-snapshot-private-opensearch-domain
Simple lambda function that snapshot private OpenSearch domain to S3 bucket

Follow this steps for configuration of the lambda function.


**Step 1: Set up the IAM role for the OpenSearch.**

In this step we want to set the role that allows the OpenSearch to access S3.

Go to the IAM console and create new role.
Choose Custom trust policy.
Add these policies:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:ListBucket"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::s3-bucket"
            ]
        },
        {
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::s3-bucket"
            ]
        }
    ]
}
```



**Step 2: Set up the IAM role for the Lambda.**

In this step we want to allow the lambda function to access OpenSearch, its VPC and give it passRole action.

Go to the IAM console and create new role.
Choose Lambda as the service that will use this role.
Attach the following policies to the role:
AmazonOpenSearchServiceFullAccess: Allows the Lambda function to interact with OpenSearch.
AWSLambdaVPCAccessExecutionRole: Allows Lambda to access resources within a VPC.

And add this inline policy:
```
{
 "Sid": "",
 "Effect": "Allow",
 "Action": [
 "iam:PassRole"
 ],
 "Resource": "arn:aws:iam::created-role-in-step1"
 }
```
Ensure the trust relationship in the role allows Lambda to assume this role.


**Step 3: Create a lambda function**

Go to Lambda function console and create new function.
Choose “Author from Scratch”.
Enter the function name, choose runtime Node.js 20.x .
In permissions, choose use an existing role and choose the created role in step 2.
Zip the project and upload it to the lambda console.


**Step 4: Create VPC configuration and security group for the lambda function.**

We should allow the lambda function to access the VPC of the OpenSearch domain.

1- Create security group:
create a security group for the lambda function (ex: lambda-opensearch-sg).
Allow outbound traffic to the OpenSearch domain on port 443 (HTTPS).
Ensure the OpenSearch security group allow inbound traffic for the lambda function security group.

2- Configure the VPC conenction:
In the lambda function console, choose configuration then form the side menu choose VPC and choose the OpenSearch VPC, subnets and the created security group as shown in the image below.


**Step 5: Test the function**

1- Create a Test Event:
In the Lambda console, create a test event with a basic JSON payload containing the required indices.
Execute the Lambda function.

2- Verify Snapshot Creation:
Check the OpenSearch domain to ensure the snapshot was created.
Verify that the snapshot is stored in the specified S3 bucket.
