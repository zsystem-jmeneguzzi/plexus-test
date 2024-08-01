declare namespace gapi {
  namespace auth2 {
    interface GoogleAuth {
      isSignedIn: {
        get(): boolean;
        listen(listener: (isSignedIn: boolean) => void): void;
      };
      signIn(): void;
      signOut(): void;
      currentUser: {
        get(): GoogleUser;
      };
    }

    interface GoogleUser {
      getBasicProfile(): BasicProfile;
    }

    interface BasicProfile {
      getId(): string;
      getName(): string;
      getGivenName(): string;
      getFamilyName(): string;
      getImageUrl(): string;
      getEmail(): string;
    }
  }

  namespace client {
    interface InitParams {
      apiKey: string;
      clientId: string;
      discoveryDocs: string[];
      scope: string;
    }

    function init(params: InitParams): Promise<void>;

    namespace calendar {
      namespace events {
        interface InsertParams {
          calendarId: string;
          resource: any;
        }

        function insert(params: InsertParams): Promise<any>;
      }
    }
  }

  function load(libraries: string, callback: () => void): void;

  var auth2: {
    getAuthInstance(): gapi.auth2.GoogleAuth;
  };
}
