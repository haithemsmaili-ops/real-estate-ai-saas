# n8n Re-Integration Instructions (Google Sheets to Internal Database API)

This guide documents how to reconfigure the n8n chatbot workflows to use the new local JSON database endpoints instead of the legacy Google Sheets integration.

---

## Node 1: Replacing Property Search (`search_real_estate`)

### Old Node Configuration (Google Sheets Read)
- **Node Type**: Google Sheets -> Get Rows / Search
- **Action**: Fetch listings from Sheet `Properties`

### New Node Configuration (HTTP Request)
1. Delete the Google Sheets `search_real_estate` node.
2. Create a new **HTTP Request** node.
3. Configure the HTTP Request node with these settings:
   - **Method**: `GET`
   - **URL**: `{{$env.NEXT_PUBLIC_APP_URL || "https://your-domain.vercel.app"}}/api/properties`
   - **Headers**:
     - `Content-Type`: `application/json`
   - **Authentication**: None (or custom secret token header if secured in production)
4. **Data Extraction**:
   - The response returns a JSON array of properties:
     ```json
     [
       {
         "id": "prop_1",
         "title": "فيلا فاخرة مع مسبح في المرادية",
         "type": "sale",
         "price": "45,000,000 دج",
         "location": "المرادية، الجزائر",
         "status": "available",
         "createdAt": "2026-08-01T12:00:00.000Z"
       }
     ]
     ```
   - Update any downstream workflow references to map from the returned JSON properties (e.g., `{{ $json.title }}`, `{{ $json.price }}`) instead of the Google Sheets columns.

---

## Node 2: Replacing Lead Appending (`Append row in sheet`)

### Old Node Configuration (Google Sheets Append)
- **Node Type**: Google Sheets -> Append Row
- **Action**: Append name, phone, channel status to Sheet `Leads`

### New Node Configuration (HTTP Request)
1. Delete the Google Sheets `Append row in sheet` node.
2. Create a new **HTTP Request** node.
3. Configure the HTTP Request node with these settings:
   - **Method**: `POST`
   - **URL**: `{{$env.NEXT_PUBLIC_APP_URL || "https://your-domain.vercel.app"}}/api/leads`
   - **Headers**:
     - `Content-Type`: `application/json`
   - **Body Type**: `JSON`
   - **Specify Body**: `Using Fields Below` or `JSON (RAW)`
   - **JSON Raw Body Parameters**:
     ```json
     {
       "tenantId": "demo",
       "name": "{{$node[\"Extract Lead Info\"].json[\"name\"]}}",
       "phone": "{{$node[\"Extract Lead Info\"].json[\"phone\"]}}",
       "email": "{{$node[\"Extract Lead Info\"].json[\"email\"]}}",
       "source": "whatsapp",
       "status": "qualified",
       "intentScore": "{{$node[\"Extract Lead Info\"].json[\"intentScore\"]}}",
       "locale": "ar"
     }
     ```
4. **Response Handling**:
   - The API will respond with `200 OK` and the created lead details to confirm storage success.
