# 🏦 Yellow Bank - Gen AI Banking Agent
A production-ready conversational AI agent built on the **Yellow.ai** platform. This agent orchestrates secure authentication and dynamic data retrieval for a mock banking ecosystem.

---

## The Assignment Brief
**Objective**: Design a Gen AI Banking Agent for "Yellow Bank" that facilitates secure access to loan details.

### Core Requirements:
1.  **Intent Recognition**: Identify requests like "I want to check my loan details."
2.  **Identity Verification**: Collect Phone Number and Date of Birth (DOB).
3.  **Secure OTP Flow**: Trigger a mock OTP via API and verify user input.
4.  **Workflow A (Discovery)**: Fetch Loan Account IDs and render them as interactive **Carousel Cards**.
5.  **Workflow B (Retrieval)**: Fetch raw technical details (interest rate, tenure, etc.) for the selected account.
6.  **Token Optimization**: Implement a data projection method to handle "massive" API responses efficiently.
7.  **English-Only Constraint**: Restrict the agent to English conversations only.
8.  **Edge Case Handling**: Allow users to change their phone number mid-flow without losing the intent.

---

## 🏗️ Technical Architecture
The system uses a **Hybrid Orchestration** model:
*   **Yellow.ai**: Handles NLU (Intent/Entity recognition), State Management, and LLM Guardrails.
*   **Beeceptor**: Provides the mock RESTful API layer for identity and financial data.

### Logic Flow 
![Yellow.ai Flow Architecture](./docs/images/yellow_ai_flow.png)

```mermaid
graph TD
    User((User)) -->| "Show loan details"| Yellow[Yellow.ai Super Agent]
    Yellow -->| "POST /trigger-otp"| Beeceptor[Beeceptor Mock Server]
    Beeceptor -->| "Return OTP (1234)"| Yellow
    Yellow -->| "Verify OTP"| User
    User -->| "OTP Verified"| Yellow
    Yellow -->| "POST /get-accounts"| Beeceptor
    Beeceptor -->| "Massive JSON"| Function[JS Projection Node]
    Function -->| "Lightweight JSON"| Yellow
    Yellow -->| "Dynamic Carousel"| User
```

---

## 🛠️ Step-by-Step Implementation

### 1. Secure Authentication & OTP
The agent collects the `phone_number` and `dob`, then triggers a `POST` request to Beeceptor. To prevent hallucinations, the OTP verification is handled via a **Logic Condition** rather than letting the LLM guess the value.

### 2. Workflow A: The "Discovery" Layer
The challenge was handling a mock API that returns 15+ fields. I implemented a **JavaScript Projection Function** to filter the data:
```javascript
// Data Projection used in Yellow.ai Function Node
return { 
    accounts: data.data.loan_accounts.map(account => ({
        loan_account_id: account.loan_account_id,
        loan_type: account.loan_type,
        tenure_months: account.tenure_months
    }))
};
```
This ensures the LLM stays within its token limits and doesn't mix up internal bank codes with user-facing data.

### 3. Workflow B: Dynamic Card Retrieval
Once a user clicks "Select" on a Carousel card, the `loan_account_id` is passed as a variable to the final Details API. The response is formatted into a clean, readable message using Triple-Curly-Bracket `{{{variable}}}` syntax.

---

## API Endpoints (Beeceptor)
All mock rules are configured on `bhavyas-bank.free.beeceptor.com` and `bhavya-bank.free.beeceptor.com`:
*   `POST /api/auth/trigger-otp`: Generates the verification code.
*   `POST /api/auth/verify-otp`: Validates the user-entered OTP.
*   `POST /api/loans/accounts`: Returns the projected loan list.
*   `POST /api/loans/details`: Provides specific tenure and interest details.

---

## Summary
This project demonstrates the ability to build **Enterprise-Grade AI Agents** that are not just conversational, but secure, efficient, and integrated with real-world technical constraints.

---
**Developed by Bhavya Keerthi K**  
[LinkedIn](https://linkedin.com/in/bhavya-keerthi-karanam) | [GitHub](https://github.com/bhavya-keerthi3)
