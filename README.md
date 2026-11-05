# Users
User management API for Node.js servers.

A brand new redesign of an old user management API (which is now abandoned and never made it to its v1.0 release).

# Usage
`Users` serves multiple built-in integrations.\
Check the `integrations/` folder for specific integrations.\
The integration name is the same as the folder path (e.g., `supabase`).
Install via npm:
```
npm install @beanthealien/users/{INTEGRATION-NAME}
```
## Usage (Supabase)
Our primary integration is for Supabase.\
The integration can be found in `./integrations/supabase/`.\
You can install it via:
```
npm install @beanthealien/users/supabase
```