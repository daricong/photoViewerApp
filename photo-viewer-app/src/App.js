import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import AdminPanel from "./components/AdminPanel";
import UserPanel from "./components/UserPanel";
import "./App.css";

function App() {
  return (
    <div>
      <Authenticator>
        {({ signOut, user }) => {
          // Check if user is part of the Admin group
          const isAdmin =
            user.signInUserSession.accessToken.payload[
              "cognito:groups"
            ]?.includes("ADMIN");

          return (
            <div>
              <button className="sign-out-button" onClick={signOut}>
                Sign Out
              </button>
              {isAdmin ? <AdminPanel /> : <UserPanel />}
            </div>
          );
        }}
      </Authenticator>
    </div>
  );
}

export default App;
