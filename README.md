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

### [POST] /api/users _(RESTRICTED)_
- Takes in a username, finds the user by that username, and returns that user's user_id inside of an object

_Send_
```json
{
  "username": "user",
}
```

_Response_
```json
{
  "user_id": 1,
}
```

## POTLUCKS _(RESTRICTED)_

### [GET] /api/potlucks
- Returns array of potlucks in database

_Response_
```json
[
  {
    "potluck_id": 1,
    "potluck_name": "potluck 1",
    "date": "2021-12-21",,
    "time": "11:00:00",
    "location": "america",
    "user_id": 1
  }
]
```
### [GET] /api/potlucks/:potluck_id
- Returns array of potlucks by potluck ID

```json
[
  {
    "potluck_id": 1,
    "potluck_name": "potluck 1",
    "date": "2021-12-21",,
    "time": "11:00:00",
    "location": "america",
    "user_id": 1
    "guests": [
      {
        "user_id": 1,
        "username": "user",
        "attending": true
      }
    ]
    "foods": [
      {
        "food_name": "pizza",
        "user_id": 1,
        "username": "user"
      }
    ]
  }
]
```
### [GET] /api/potlucks/:potluck_id/guests
- Returns array of guests by potluck ID

```json
[
 {
  "user_id": 1,
  "username": "user",
  "attending": true
 }
]
```
### [GET] /api/potlucks/:potluck_id/foods

- Returns array of food by potluck ID

```json
[
 {
  "food_name": "pizza",
  "user_id": 1,
  "username": "user"
 }
]
```
### [POST] /api/users/:user_id/potlucks
- Creates new potluck object by individual users
  - _potluck_name required_
  - _date required_
  - _time required_
  - _location required_

_Send_
```json
{
 "potluck_name": "potluck 1",
 "date": "2021-12-21",
 "time": "12:00:00",
 "location": "nowhere"
}
```
_Response_
```json
{
 "potluck_name": "potluck 1",
 "date": "2021-12-21",
 "time": "12:00:00",
 "location": "nowhere"
 "user_id": 1,
 "guests": [
  {
    "user_id": 1,
    "username": "user",
    "attending": true,
  }
 ]
}
```
### [POST] /api/potlucks/:potluck_id/guests

- Add guests by potluck ID
  - _user_id required_
  - _attending required_

_Send_
```json
{
 "user_id": 1,
 "attending": true
}
```

_Response_
```json
{
 "user_id": 1,
 "username": "user",
 "attending": true
}
```

## [POST] /api/potlucks/:potluck_id/foods
- Add food by potluck ID
  - food_name required

_Send_
```json
{
  "food_name": "pizza",
}
```

_Response_
```json
[
 {
  "food_name": "pizza",
  "user_id": 1,
  "username": "user"
 }
]
