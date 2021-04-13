import React from "react";

import { AuthProvider } from "./auth";
import { UserProvider } from "./user";
import { OfficeProvider } from "./office";
import { ProfileProvider } from "./profile";
import { SearchProvider } from "./search";
import { ConnectSearchProvider } from "./connectSearch";
import { FoundationProvider } from "./foundation";
import { ProgramProvider } from "./program";
import { EvaluatorProvider } from "./evaluators";
import { ResearcherProvider } from "./researcher";
import { ProjectProvider } from "./project";

const AppProvider = ({ children }) => (
  <AuthProvider>
    <UserProvider>
      <OfficeProvider>
        <ProfileProvider>
          <ConnectSearchProvider>
            <SearchProvider>
              <FoundationProvider>
                <ProgramProvider>
                  <ResearcherProvider>
                    <EvaluatorProvider>
                      <ProjectProvider>
                        {children}
                      </ProjectProvider>
                    </EvaluatorProvider>
                  </ResearcherProvider>
                </ProgramProvider>
              </FoundationProvider>
            </SearchProvider>
          </ConnectSearchProvider>
        </ProfileProvider>
      </OfficeProvider>
    </UserProvider>
  </AuthProvider>
);

export default AppProvider;
