// Projection function for Workflow A (getLoanAccounts)
// Purpose: Filter out unnecessary metadata to save LLM tokens.

function projectLoanAccounts(data) {
    const fullData = data.data.loan_accounts;

    // Extraction only current required fields
    const projectedAccounts = fullData.map(account => ({
        loan_account_id: account.loan_account_id,
        loan_type: account.loan_type,
        tenure_months: account.tenure_months
    }));

    return { accounts: projectedAccounts };
}

// Logic for Workflow B (loanDetails) formatting
function formatLoanDetails(data) {
    const details = data.data;
    return {
        loan_type: details.loan_type,
        tenure: details.tenure_months + " months",
        interest_rate: details.interest_rate + "%",
        principal_pending: "₹" + details.principal_pending.toLocaleString('en-IN'),
        next_due_date: details.next_due_date,
        nominee: details.nominee_name
    };
}
