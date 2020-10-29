import React from "react";

import { AuthProvider } from "./auth";
import { OfficeProvider } from "./office";
import { ProfileProvider } from "./profile";
import { SearchProvider } from "./search";
import { FoundationProvider } from "./foundation";
import { ProgramProvider } from "./program";

const AppProvider = ({ children }) => (
  <AuthProvider>
    <OfficeProvider>
      <ProfileProvider>
        <SearchProvider>
          <FoundationProvider>
            <ProgramProvider>
              {children}
            </ProgramProvider>
          </FoundationProvider>
        </SearchProvider>
      </ProfileProvider>
    </OfficeProvider>
  </AuthProvider>
);

export default AppProvider;
