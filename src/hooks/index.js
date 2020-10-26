import React from "react";

import { AuthProvider } from "./auth";
import { OfficeProvider } from "./office";
import { ProfileProvider } from "./profile";

const AppProvider = ({ children }) => (
  <AuthProvider>
    <OfficeProvider>
      <ProfileProvider>
        {children}
      </ProfileProvider>
    </OfficeProvider>
  </AuthProvider>
);

export default AppProvider;
