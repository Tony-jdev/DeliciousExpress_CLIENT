export default interface apiResponse {
    data?: {
      success?: boolean;  
      message?: string ;
      data: {
        [key: string]: string;
      };
    };
    error?: any;
  }