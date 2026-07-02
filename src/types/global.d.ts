interface Window {
  Trustpilot?: {
    loadFromElement: (element: HTMLElement, reload?: boolean) => void;
  };
  gtag?: (...args: unknown[]) => void;
}

declare namespace google.maps {
  namespace places {
    class Autocomplete {
      constructor(input: HTMLInputElement, options?: AutocompleteOptions);
      getPlace(): PlaceResult;
      addListener(event: string, handler: () => void): void;
    }
    interface AutocompleteOptions {
      types?: string[];
      componentRestrictions?: { country: string | string[] };
      fields?: string[];
    }
    interface PlaceResult {
      formatted_address?: string;
      name?: string;
      address_components?: AddressComponent[];
    }
    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }
  }
  namespace event {
    function clearInstanceListeners(instance: object): void;
  }
}
