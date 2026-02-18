import os, json
import anthropic  # or openai

PROMPT_TEMPLATE = """You are a support ticket classifier. Given the ticket description below, return ONLY a JSON object with two fields:
- "category": one of ["billing", "technical", "account", "general"]
- "priority": one of ["low", "medium", "high", "critical"]

Rules:
- billing: payment, invoice, refund, charge issues
- technical: bugs, errors, crashes, integration failures
- account: login, password, access, profile issues
- general: everything else
- critical: system down, data loss, security breach
- high: major feature broken, multiple users affected
- medium: single user affected, workaround exists
- low: cosmetic issues, questions, feature requests

Description: {description}

Respond with ONLY the JSON, no explanation."""

def classify_ticket(description: str) -> dict:
    """Returns suggested category and priority. Returns None values on any failure."""
    try:
        client = anthropic.Anthropic(api_key=os.environ.get('LLM_API_KEY', ''))
        message = client.messages.create(
            model="claude-3-5-haiku-latest",  # fast + cheap
            max_tokens=100,
            messages=[{"role": "user", "content": PROMPT_TEMPLATE.format(description=description)}]
        )
        text = message.content[0].text.strip()
        result = json.loads(text)

        # Validate values are in allowed choices
        valid_categories = ['billing', 'technical', 'account', 'general']
        valid_priorities = ['low', 'medium', 'high', 'critical']
        return {
            "suggested_category": result.get("category") if result.get("category") in valid_categories else "general",
            "suggested_priority": result.get("priority") if result.get("priority") in valid_priorities else "medium",
        }
    except Exception:
        return {"suggested_category": None, "suggested_priority": None}