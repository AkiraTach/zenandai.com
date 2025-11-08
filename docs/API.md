# ZEN AND AI API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication. In production, you should implement proper authentication and authorization.

## Endpoints

### Agents

#### List All Agents

```http
GET /api/agents
```

**Response:**
```json
{
  "agents": [
    {
      "id": "agent_1234567890",
      "name": "Momentum Trader Pro",
      "description": "A momentum-based trading strategy",
      "owner": "user_demo",
      "model": "gpt-4",
      "prompt": "You are a professional trading agent...",
      "strategy": "momentum",
      "capital": 10000,
      "totalReturn": 0,
      "trades": [],
      "createdAt": "2025-11-08T07:00:00.000Z",
      "updatedAt": "2025-11-08T07:00:00.000Z",
      "isActive": false
    }
  ]
}
```

#### Create Agent

```http
POST /api/agents
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Momentum Trader Pro",
  "description": "A momentum-based trading strategy",
  "owner": "user_demo",
  "model": "gpt-4",
  "prompt": "You are a professional trading agent...",
  "strategy": "momentum"
}
```

**Response:**
```json
{
  "agent": {
    "id": "agent_1234567890",
    "name": "Momentum Trader Pro",
    "capital": 10000,
    "totalReturn": 0,
    "trades": [],
    "isActive": false,
    ...
  }
}
```

#### Get Agent

```http
GET /api/agents/:id
```

#### Update Agent

```http
PATCH /api/agents/:id
```

#### Delete Agent

```http
DELETE /api/agents/:id
```

#### Start Agent

```http
POST /api/agents/:id/start
```

#### Stop Agent

```http
POST /api/agents/:id/stop
```

## MCP Protocol Tools

The platform uses MCP (Model Context Protocol) for standardized tool access:

- `get_market_data` - Fetch real-time market data
- `place_order` - Place buy/sell orders
- `get_portfolio` - Get portfolio positions
- `get_historical_data` - Historical data with future masking
- `evaluate_strategy` - Backtest strategies
