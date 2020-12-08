import React from "react";

import { AuthProvider } from "./auth";
import { UserProvider } from "./user";
import { OfficeProvider } from "./office";
import { ProfileProvider } from "./profile";
import { SearchProvider } from "./search";
import { FoundationProvider } from "./foundation";
import { ProgramProvider } from "./program";
import { EvaluatorProvider } from "./evaluators";
import { ResearcherProvider } from "./researcher";

const AppProvider = ({ children }) => (
  <AuthProvider>
    <UserProvider>
      <OfficeProvider>
        <ProfileProvider>
          <SearchProvider>
            <FoundationProvider>
              <ProgramProvider>
                <ResearcherProvider>
                  <EvaluatorProvider>
                    {children}
                  </EvaluatorProvider>
                </ResearcherProvider>
              </ProgramProvider>
            </FoundationProvider>
          </SearchProvider>
        </ProfileProvider>
      </OfficeProvider>
    </UserProvider>
  </AuthProvider>
);

export default AppProvider;
