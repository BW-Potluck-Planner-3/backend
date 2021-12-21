# <p>Backend For Potluck-Planner-3</P>


## <p>https://potluck-planner-3-ft.herokuapp.com/</p>

## REGISTER / LOGIN

### [POST] /api/auth/register

- User register
  - _username required (must be unique)_
  - _password required_

_Send_
```json
{
  "username": "user",
  "password": "password"
}
```
_Response_
```json
{
  "message": "Successfully registered user"
}
```

### [POST] /api/auth/login

- User login
  - _username required_
  - _password required_

_Send_
```json
{
  "username": "user",
  "password": "password"
}
```

_Response_
```json
{
  "message": "Welcome back user!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ikpva",
  "user_id": 1
}
```
## USERS

### [GET] /api/users _(RESTRICTED)_

- Return array of users
  - _requires token in header_

_Response_
```json
[
  {
    "user_id": 1,
    "username": "user"
  },
  {
    "user_id": 2,
    "username": "user2"
  }
]
```
### [GET] /api/users/:user_id _(RESTRICTED)_

- Return user with specified user_id
  - _requires token in header_

_Response_
```json
{
  "user_id": 1,
  "username": "user"
}
```
