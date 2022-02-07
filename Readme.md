# Setting up on AWS:

I had to setup an SES service
Reason being that when somebody registers on my site it sends them a confirmation email
To register them.

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