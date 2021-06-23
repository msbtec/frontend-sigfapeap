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
// eslint-disable-next-line import/named
import { ProjectProvider } from "./project";
import { DocumentProvider } from "./document";
import { ArchiveProvider } from "./archive";
import { ContactProvider } from "./contact";
import { PublishProvider } from "./publish";

const AppProvider = ({ children }) => (
  <AuthProvider>
    <UserProvider>
      <OfficeProvider>
        <DocumentProvider>
          <ArchiveProvider>
            <PublishProvider>
              <ProfileProvider>
                <ConnectSearchProvider>
                  <SearchProvider>
                    <FoundationProvider>
                      <ProgramProvider>
                        <ResearcherProvider>
                          <EvaluatorProvider>
                            <ProjectProvider>
                              <ContactProvider>
                                  {children}
                                </ContactProvider>
                            </ProjectProvider>
                          </EvaluatorProvider>
                        </ResearcherProvider>
                      </ProgramProvider>
                    </FoundationProvider>
                  </SearchProvider>
                </ConnectSearchProvider>
              </ProfileProvider>
            </PublishProvider>
          </ArchiveProvider>
        </DocumentProvider>
      </OfficeProvider>
    </UserProvider>
  </AuthProvider>
);

export default AppProvider;
