# AICRM Lite — Screens (MVP) + ASCII Mockups

## 1) Leads List Screen
**Purpose**
- View all leads
- Search by name
- Open lead details
- Create new lead

**Key UI**
- Search input
- Leads list/table
- "+ Add Lead” button

**ASCII Mockup**

```ascii
+——————————————————————————————————————————————————————+
| AICRM Lite                              [+ Add Lead] |
+——————————————————————————————————————————————————————+
| Search: [ Acme…………….. ]                    |
+——————————————————————————————————————————————————————+

Leads
Name
——————————————————————————————————————————————————————
Acme Corp
Beta Solutions
Gamma Inc
+——————————————————————————————————————————————————————+
Click a row to view details
+——————————————————————————————————————————————————————+
```
---

## 2) Add / Edit Lead Screen
**Purpose**
- Create a lead
- Update lead details (including status)

**Fields**
- name (required)
- email
- phone
- status
- source
- ai_summary

**ASCII Mockup**
```
+——————————————————————————————————————————————————————+
| Lead Form                                            |
+——————————————————————————————————————————————————————+
| Name*      : [ Acme Corp__________________________ ] |
| Email      : [ contact@acme.com___________________ ] |
| Phone      : [ +1-555-0123________________________ ] |
| Status     : [ new v ]                               |
| Source     : [ website_____________________________ ] |
| AI Summary : [ Tech startup…_____________________ ] |
|             [______________________________________ ] |
+——————————————————————————————————————————————————————+
| [Cancel]                                       [Save] |
+——————————————————————————————————————————————————————+
```

---

## 3) Lead Details Screen (with Interactions)
**Purpose**
- View lead details
- Update lead status
- View interaction timeline
- Add new interaction

**Key UI**
- Lead summary block
- Status dropdown
- AI summary section
- Interactions list + “+ Add” button

**ASCII Mockup**
```
+——————————————————————————————————————————————————————+
| Lead Details                                 [Edit]  |
+——————————————————————————————————————————————————————+
| Name   : Acme Corp                                   |
| Email  : contact@acme.com                             |
| Phone  : +1-555-0123                                  |
| Status : [ contacted v ]   Source: website            |

Created: 2025-01-15
AI Summary
Tech startup, 50 employees, needs CRM
——————————————————————————————————————————————————————
Interactions                          [+ Add]
——————————————————————————————————————————————————————
2025-01-16 10:30
2025-01-15 18:10
+——————————————————————————————————————————————————————+
```

---

## 4) Add Interaction Screen (Modal or Page)
**Purpose**
- Log a new interaction for a lead
- Generate a suggested message to communicate next (based on past interactions)

**Fields**
- type (call/email/meeting/note)
- notes
- suggested_message (generated, editable)

**Actions**
- Suggest (generates message)
- Copy (copies suggested message)
- Save (saves interaction)

**ASCII Mockup**
```
+——————————————————————————————————————————————————————+
| Add Interaction                                      |
+——————————————————————————————————————————————————————+
| Type  : [ call v ]                                   |
| Notes : [ Spoke with decision maker. Demo requested ]|
|         [__________________________________________ ]|
|                                                      |
| Suggested message (based on past interactions)        |
| [__________________________________________________ ]|
| [__________________________________________________ ]|
|                                                      |
| [Suggest]   [Copy]                                   |
+——————————————————————————————————————————————————————+
| [Cancel]                                       [Save] |
+——————————————————————————————————————————————————————+
```