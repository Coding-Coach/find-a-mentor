### Run

```bash
nodemon --config netlify/functions-src/functions/email/templates/nodemon-emails.json
```

> **ℹ️ Info**
> The welcome email template is managed by Auth0 as part of the email verification process.
> You can view and edit the template in the [Auth0 Dashboard](https://manage.auth0.com/dashboard/eu/codingcoach/templates).

### Links

|||
|--- |--- |
|Welcome|http://localhost:3003/welcome?data={%22name%22:%22Moshe%22}|
|Mentorship accepted|http://localhost:3003/mentorship-accepted?data={%22menteeName%22:%22Moshe%22,%22mentorName%22:%20%22Brent%22,%22contactURL%22:%20%22https%22,%20%22openRequests%22:%208}|
|Mentorship declined|http://localhost:3003/mentorship-declined?data={%22menteeName%22:%22Moshe%22,%22mentorName%22:%22Brent%22,%22reason%22:%22because%22}|
|Mentorship declined (by system)|http://localhost:3003/mentorship-declined?data={%22menteeName%22:%22Moshe%22,%22mentorName%22:%22Brent%22,%22reason%22:%22because%22,%22bySystem%22:true}|
|Mentorship cancelled|http://localhost:3003/mentorship-cancelled?data={%22menteeName%22:%22Moshe%22,%22mentorName%22:%20%22Brent%22,%22reason%22:%20%22I%27ve%20already%20found%20a%20mentor%22}|
|Mentorship requested|http://localhost:3003/mentorship-requested?data={%22menteeName%22:%22Moshe%22,%22mentorName%22:%22Brent%22,%22message%22:%22because%22,%22background%22:%22here%20is%20my%20background%22,%22expectation%22:%22Im%20expecting%20for%20the%20best!%22}|
|Mentorship reminder|http://localhost:3003/mentorship-reminder?data={%22menteeName%22:%22Moshe%22,%22mentorName%22:%22Brent%22,%22message%22:%22because%22}|
|Mentor application received|http://localhost:3003/mentor-application-received?data={%22name%22:%22Brent%22}|
|Mentorship application denied|http://localhost:3003/mentor-application-declined?data={%22name%22:%22Moshe%22,%22reason%22:%22your%20avatar%20is%20not%20you%22}|
|Mentorship application approved|http://localhost:3003/mentor-application-approved?data={%22name%22:%22Moshe%22}|
|Email Verification|http://localhost:3003/email-verification?data={%22name%22:%22Moshe%22,%20%22link%22:%20%22https://mentors.codingcoach.io%22}|
|Mentor application admin notification|http://localhost:3003/mentor-application-admin-notification?data={%22name%22:%22Moshe%22,%22email%22:%22moshe@example.com%22,%22title%22:%22Senior%20Developer%22,%22tags%22:[%22javascript%22,%22react%22],%22country%22:%22Israel%22,%22spokenLanguages%22:[%22English%22,%22Hebrew%22],%22avatar%22:%22https://example.com/avatar.jpg%22,%22status%22:%22Pending%22}|