const localStorageMock = {
    getItem: jest.fn((key) => {
      if (key === "user") {
        return JSON.stringify(null);  // Mock a valid JSON response
      }
      return null;
    }),
    setItem: jest.fn(),
    clear: jest.fn()
  };
  
  global.localStorage = localStorageMock;
  