# Setting up on AWS:

I had to setup an SES service
Reason being that when somebody registers on my site it sends them a confirmation email
To register them.

## Setting up s3 Bucket:
        1. Add a IAM role to your user:
                1. Go to the top search bar and search for IAM
                2. The first one that pops up should say IAM
                3. When you are on the IAM dashboard
                4. Under the IAM resource section
                5. There should be a heading that says Users
                6. click on users
                7. click on the user that you want to handle the s3 bucket
                8. click on Add permissions
                9. There will be 3 different policies
                10. click on the one that says, "Attach existing policies directly"
                11. in the search bar type s3 which should bring up all existing policies
                12. click on the policy that says, "AmazonS3FullAccess"
                13. which gives full access to the user
                14. keep on clicking the next blue button at the bottom to add the policy
        2. Once the policy is added
        3. in the search bar at the top type s3 to go to the s3 Dashboard
        4. click the button that says create a bucket
        5. type the name of the bucket
        6. bear in mind that this name needs to be unique accross the hole of aws
        7. select what region you want your bucket to be in
        8. under object ownership select ACL's enabled
        9. unselect the Block all public access under the heading Block public access
        10. all other setting you can leave as is, just click the orange button at the bottom
        11. that says, "Create bucket"
        12. once the bucket is created store your environment variables in the .env file
        13. connect to the s3 bucket as i did in the server directory

## How I set up SES service on AWS:
The first thing that I had to do was make sure that I had created a new user on the IAM Dashboard
There is a panel on the lefthand side that says Users, click on that
Click on the Big blue button in the right hand side says Add users
On the form enter your name and click the checkbox that says Access key - Programmatic access
Then click on Next: Permissions blue button bottom right
You need to now add permissions policy to use AWS SES
Click on the Document that says, "Attach existing policies directly".
Once you click on that there will be a list of all the policies that AWS offers
In the search field type: SES this will show all policies related to SES service
Click on the checkbox that says AmazonSESFullAccess
Click the Next: Tags big blue button bottom righthand side
Keep on clicking the big blue button until it says Create user
It will then show you a Success Screen with your access key and Secret key
Make sure to keep that safe and backed up
The secret and Access key you need to place in the .env file

AWS_ACCESS_KEY_ID=key goes here
AWS_SECRET_KEY=key goes here
AWS_REGION=region goes here

The next step would be to go the the SES Dashboard
To do that at the top there is a search field type SES in that field SES should popup as first result
Then I need to Create an Identity to use this service
Click on the orange button that says, "Create identity"
Click on the document that says Email address
Enter your email address in the input feild and click the orange button that says Create identity
It will then send, you an email to the email address, which needs to be verified
Click on the link that was sent to you to verify it.

The next step is then to program it out under the server directory in controllers/auth.js
If you go onto google and type AWS SES node
It will show you how it is done with nodejs
