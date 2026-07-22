# NEXUS API

NEXUS is an intelligent goal management REST API designed to help users manage goals, track progress, and receive actionable recommendations.

## Current Features

- Create goals
- Retrieve all goals
- Retrieve a specific goal
- Update goals
- Delete goals
- Track goal progress
- Automatically determine goal status
- Generate next-action recommendations
- Validate user input

## Tech Stack

- Node.js
- Express.js
- JavaScript
- REST API
- Git & GitHub

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/goals` | Get all goals |
| POST | `/api/goals` | Create a goal |
| GET | `/api/goals/:id` | Get one goal |
| PUT | `/api/goals/:id` | Update a goal |
| DELETE | `/api/goals/:id` | Delete a goal |
| GET | `/api/goals/:id/next-action` | Get intelligent recommendation |

## Running Locally

Clone the repository:

```bash
git clone https://github.com/jeevitha-r1/NEXUS_API.git# NEXUS_API
