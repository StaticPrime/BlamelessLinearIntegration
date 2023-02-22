## BlamelessLinearIntegration
A Webhook API to connect your Blameless Incidents to your Linear Project. This is a one way integration, and Blameless should be used as your source of truth.

## Blameless to Linear
Blameless incoming webhooks will generate Linear Tickets with the associated Team & Project. Tasks in Blameless are added to the Linear Ticket description as "checkbox" items. Followup Actions in Blameless are added as Subtasks of the main ticket in Linear.

# Blameless webhooks this tool integrates with:
| Blameless Webhook  | Webhook |
| ------------- | ------------- |
| Incident Created  | POST /v1/blameless/created |
| Followup Action Created  | POST /v1/blameless/followup-action-created |
| Incident Severity Changed  | POST /v1/blameless/severity-change |
| Incident Status Changed  | POST /v1/blameless/status-change |
| Task Assigned  | POST /v1/blameless/task-assigned |

# API Payload for Blameless Webhooks
The API Payloads are all in POST and require the following sent into the body:
{
 "action": "",
 "incidentID": "",
 "followUpActionTitle: ""   
}

# Supported Actions
incident.created
incident.status_change
incident.severity_change
incident.followup_action_created

## Disclaimer
This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Blameless, Linear or any of their subsidiaries or affiliates. The official Blameless website can be found at https://www.blameless.com. The official Linear website can be found at https://www.linear.com. "Blameless" and "Linear" as well as related names, marks, emblems and images are registered trademarks of their respective owners.

## License
Copyright 2023 Jason Breault

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.