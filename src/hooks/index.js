import React from "react";

import { AuthProvider } from "./auth";
import { OfficeProvider } from "./office";
import { ProfileProvider } from "./profile";
import { SearchProvider } from "./search";
import { FoundationProvider } from "./foundation";
import { ProgramProvider } from "./program";
import { EvaluatorProvider } from "./evaluators";

const AppProvider = ({ children }) => (
  <AuthProvider>
    <OfficeProvider>
      <ProfileProvider>
        <SearchProvider>
          <FoundationProvider>
            <ProgramProvider>
              <EvaluatorProvider>
                {children}
              </EvaluatorProvider>
            </ProgramProvider>
          </FoundationProvider>
        </SearchProvider>
      </ProfileProvider>
    </OfficeProvider>
  </AuthProvider>
);

export default AppProvider;
