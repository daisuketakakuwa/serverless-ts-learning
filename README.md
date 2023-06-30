## Technical Stack

- Node.js 18
- TypeScript
- Serverless
- AWS CloudFormation
- AWS Lambda
- AWS S3

## About Serverless

### 1. Need admin role to execute `sls deploy`

- `sls`コマンドは、`.aws/credentials`ファイルを参照する。
- Admin 権限をもつ IAM ユーザーをコンソールで作成する＆`aws configure`で設定する。

### 2. Serverless creates IAM role for service(one serverless.yml) automatically.

- Lambda は各 AWS 資源(CloudWatch 等)にアクセスするために IAM ロールを assume する。そのためのロール。
- `provider.iam`で既存の IAM ロールを指定することも可能。

https://www.serverless.com/framework/docs/providers/aws/guide/iam/

### 3. `functions.hogeFunc.events.s3`は、自動で S3 バケットを生成する。

- `Resources`配下で作成することも可能だが、これは serverless がデプロイ時に生成する CloudFormation template に直接書くようなもの。
- `functions.hogeFunc.events.s3`で自動生成される S3 バケットの設定をしたい場合は、`provider.s3`で設定を行う。

#### `provider.s3`設定時の注意

以下のように`provider.s3.xxxxBucket`の`xxxxBucket`を、functions 側で参照する。ここで丸 2 日くらいはまったな...

```yml
provider:
  s3:
    helloBucket:
      name: serverless-ts-learning-bucket
      LifecycleConfiguration:
        Rules:
          - Id: GlacierRule
            Prefix: folder1/
            Status: Enabled
            ExpirationInDays: 7

functions:
  hello:
    handler: src/functions/hello.default
    events:
      - s3:
          bucket: helloBucket
```

https://www.serverless.com/framework/docs/providers/aws/events/s3

### 4. `sls deploy`で CloudFormation の template は`.serverless/`配下に生成される。

Upload する CloudFormation の Template がどんなものかローカルで確認できる。

## How to run on local

### set aws credentials

```
$ aws configure --profile offline
AWS Access Key ID [None]: S3EVER
AWS Secret Key ID [None]: S3EVER
Default region name [None]: ap-northeast-1
Default output format [None]: json
```

### start the lambda

```
npx sls offline start
```

### deploy a csv file to s3 bucket

```
aws  --endpoint http://localhost:4569 s3 cp tests/resources/sample.csv s3://hello-bucket/sample.csv
```

## How to deploy on AWS

1. Create a IAM role on AWS console and get accessKeyId and secretAccessKey from that.
2. Set ./aws/credentials with accessKeyId and secretAccessKey from 1.
3. Deploy to AWS

```
npx sls deploy stage dev
```
