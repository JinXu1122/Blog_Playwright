# JMeter Performance Test Scenarios

This directory contains JMeter performance test scenarios for validating the blog application's performance under load.

## Test Plan: BlogPerformanceTestPlan.jmx

### Performance Metrics Validated

| Metric | Description | Target |
|--------|------------|--------|
| **Response Time** | Time taken to receive response | < 2000ms |
| **Throughput** | Requests per second | > 10 req/s |
| **Error Rate** | Percentage of failed requests | < 1% |
| **Concurrent Users** | Number of simultaneous users | 10 users |

### Test Scenarios

| # | Scenario | Endpoint | Method |
|---|----------|---------|--------|
| 1 | List All Posts | `/api/posts` | GET |
| 2 | Get Single Post | `/api/posts/:id` | GET |
| 3 | Search Posts | `/api/posts?q=test` | GET |
| 4 | Filter by Category | `/api/posts?category=tech` | GET |
| 5 | Create Post | `/api/posts` | POST |

### Configuration

| Parameter | Value |
|-----------|-------|
| Thread Count | 10 |
| Ramp-up Time | 5 seconds |
| Loop Count | 5 |
| Duration | 60 seconds |

### Running the Tests

#### Prerequisites
```bash
# Install JMeter
brew install jmeter  # macOS
# or download from https://jmeter.apache.org/
```

#### Run Tests

```bash
# Navigate to jmeter directory
cd jmeter

# Run test plan
jmeter -n -t BlogPerformanceTestPlan.jmx -l results.jtl -e -o report

# View HTML report
open report/index.html
```

### Expected Results

#### Response Time (in milliseconds)

| Endpoint | Average | Min | Max | 90th %ile |
|----------|---------|-----|-----|-----------|
| GET /api/posts | < 500 | < 100 | < 2000 | < 1500 |
| GET /api/posts/:id | < 300 | < 50 | < 1000 | < 800 |
| GET /api/posts?q= | < 500 | < 100 | < 2000 | < 1500 |
| POST /api/posts | < 800 | < 200 | < 2000 | < 1500 |

#### Throughput (requests/second)

| Endpoint | Throughput |
|---------|------------|
| GET /api/posts | > 10 |
| GET /api/posts/:id | > 15 |
| POST /api/posts | > 8 |

#### Error Rate

| Target | < 1% |
|--------|-------|

### Report

The HTML report includes:
- **APDEX Score**: Application Performance Index (0-1)
- **Statistics**: Count, Error %, Throughput, Latency
- **Response Times**: Over Time chart
- **Throughput**: Requests per Second chart
- **Response Codes**: 2xx, 4xx, 5xx distribution

### Integration with CI/CD

The JMeter tests can be integrated into Jenkins using:

```bash
# Jenkins shell command
jmeter -n -t jmeter/BlogPerformanceTestPlan.jmx -l results.jtl
```
