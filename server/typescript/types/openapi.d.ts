import type {
  OpenAPIClient,
  Parameters,
  UnknownParamsObject,
  OperationResponse,
  AxiosRequestConfig,
} from 'openapi-client-axios';

declare namespace Components {
    export interface HeaderParameters {
        "if-match": Parameters.IfMatch;
        etag: Parameters.Etag;
    }
    namespace Parameters {
        export type Etag = /**
         * example:
         * 656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a
         */
        Schemas.Etag;
        /**
         * example:
         * 1
         */
        export type IdInPath = number;
        export type IfMatch = /**
         * example:
         * 656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a
         */
        Schemas.Etag;
    }
    export interface PathParameters {
        "id-in-path"?: /**
         * example:
         * 1
         */
        Parameters.IdInPath;
    }
    namespace Responses {
        export interface $201 {
        }
        export interface $204Success {
        }
        export interface $204Updated {
        }
        export type $400ValidationError = Schemas.Error;
        export type $404NotFoundError = Schemas.Error;
        export type $409Conflict = Schemas.Error;
        export type $412PreconditionError = Schemas.Error;
    }
    namespace Schemas {
        export interface Company {
            /**
             * example:
             * Firma A
             */
            name: string;
            /**
             * example:
             * FRA
             */
            abbr?: string;
            /**
             * example:
             * www.example.org
             */
            www?: string;
            /**
             * example:
             * Kunde
             */
            companytype: string;
        }
        export interface Companytype {
            /**
             * example:
             * Kunde
             */
            name: string;
        }
        export interface Error {
            status: number;
            message: string;
            errors?: any[];
        }
        /**
         * example:
         * 656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a
         */
        export type Etag = string;
        /**
         * example:
         * location/1
         */
        export type Location = string; // uri-reference
        export interface Meta {
            location: /**
             * example:
             * location/1
             */
            Location /* uri-reference */;
            etag: /**
             * example:
             * 656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a
             */
            Etag;
        }
    }
}
declare namespace Paths {
    namespace DeleteCompanyById {
        namespace Parameters {
            /**
             * example:
             * 1
             */
            export type Id = number;
        }
        export interface PathParameters {
            id: /**
             * example:
             * 1
             */
            Parameters.Id;
        }
        namespace Responses {
            export type $204 = Components.Responses.$204Success;
            export type $400 = Components.Responses.$400ValidationError;
            export type $404 = Components.Responses.$404NotFoundError;
        }
    }
    namespace DeleteCompanytypeById {
        namespace Parameters {
            /**
             * example:
             * 1
             */
            export type Id = number;
        }
        export interface PathParameters {
            id: /**
             * example:
             * 1
             */
            Parameters.Id;
        }
        namespace Responses {
            export type $204 = Components.Responses.$204Success;
            export type $400 = Components.Responses.$400ValidationError;
            export type $404 = Components.Responses.$404NotFoundError;
            export type $409 = Components.Responses.$409Conflict;
        }
    }
    namespace GetCompanies {
        namespace Responses {
            export type $200 = {
                meta: Components.Schemas.Meta;
                data: Components.Schemas.Company;
            }[];
        }
    }
    namespace GetCompanyById {
        namespace Parameters {
            /**
             * example:
             * 1
             */
            export type Id = number;
        }
        export interface PathParameters {
            id: /**
             * example:
             * 1
             */
            Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Company;
            export type $400 = Components.Responses.$400ValidationError;
            export type $404 = Components.Responses.$404NotFoundError;
        }
    }
    namespace GetCompanytypeById {
        namespace Parameters {
            /**
             * example:
             * 1
             */
            export type Id = number;
        }
        export interface PathParameters {
            id: /**
             * example:
             * 1
             */
            Parameters.Id;
        }
        namespace Responses {
            export type $200 = Components.Schemas.Companytype;
            export type $400 = Components.Responses.$400ValidationError;
            export type $404 = Components.Responses.$404NotFoundError;
        }
    }
    namespace GetCompanytypes {
        namespace Responses {
            export type $200 = {
                meta: Components.Schemas.Meta;
                data: Components.Schemas.Companytype;
            }[];
            export type $400 = Components.Responses.$400ValidationError;
            export type $404 = Components.Responses.$404NotFoundError;
        }
    }
    namespace PostCompany {
        export type RequestBody = Components.Schemas.Company;
        namespace Responses {
            export type $201 = Components.Responses.$201;
            export type $400 = Components.Responses.$400ValidationError;
        }
    }
    namespace PostCompanytype {
        export type RequestBody = Components.Schemas.Companytype;
        namespace Responses {
            export type $201 = Components.Responses.$201;
            export type $400 = Components.Responses.$400ValidationError;
        }
    }
    namespace PutCompanyById {
        export interface HeaderParameters {
            "if-match": Parameters.IfMatch;
        }
        namespace Parameters {
            /**
             * example:
             * 1
             */
            export type Id = number;
            export type IfMatch = /**
             * example:
             * 656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a
             */
            Components.Schemas.Etag;
        }
        export interface PathParameters {
            id: /**
             * example:
             * 1
             */
            Parameters.Id;
        }
        export type RequestBody = Components.Schemas.Company;
        namespace Responses {
            export type $204 = Components.Responses.$204Updated;
            export type $400 = Components.Responses.$400ValidationError;
            export type $404 = Components.Responses.$404NotFoundError;
            export type $412 = Components.Responses.$412PreconditionError;
        }
    }
    namespace PutCompanytypeById {
        export interface HeaderParameters {
            "if-match": Parameters.IfMatch;
        }
        namespace Parameters {
            /**
             * example:
             * 1
             */
            export type Id = number;
            export type IfMatch = /**
             * example:
             * 656da9646b5a65673e4a1f504ac3d44232e2da0d939413619ef0fd33850f818a
             */
            Components.Schemas.Etag;
        }
        export interface PathParameters {
            id: /**
             * example:
             * 1
             */
            Parameters.Id;
        }
        export type RequestBody = Components.Schemas.Companytype;
        namespace Responses {
            export type $204 = Components.Responses.$204Updated;
            export type $400 = Components.Responses.$400ValidationError;
            export type $404 = Components.Responses.$404NotFoundError;
            export type $412 = Components.Responses.$412PreconditionError;
        }
    }
}

export interface OperationMethods {
  /**
   * getCompanies - Get a list of all companies
   * 
   * GET request on all companies
   */
  'getCompanies'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetCompanies.Responses.$200>
  /**
   * postCompany - Create new company
   * 
   * POST request for a new company, response new id
   */
  'postCompany'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostCompany.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostCompany.Responses.$201>
  /**
   * getCompanyById - Get a certain company
   * 
   * GET request on a certain company by id {id}
   */
  'getCompanyById'(
    parameters?: Parameters<Paths.GetCompanyById.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetCompanyById.Responses.$200>
  /**
   * putCompanyById - Updates company with id {id}
   * 
   * Put request on company by id {id}
   */
  'putCompanyById'(
    parameters?: Parameters<Paths.PutCompanyById.HeaderParameters & Paths.PutCompanyById.PathParameters> | null,
    data?: Paths.PutCompanyById.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutCompanyById.Responses.$204>
  /**
   * deleteCompanyById - Remove a certain company
   * 
   * DELETE request on company by id {id}
   */
  'deleteCompanyById'(
    parameters?: Parameters<Paths.DeleteCompanyById.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteCompanyById.Responses.$204>
  /**
   * getCompanytypes - Get a list of all company types
   * 
   * GET request on all companies
   */
  'getCompanytypes'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetCompanytypes.Responses.$200>
  /**
   * postCompanytype - Add new company type
   * 
   * POST request for a new company type
   */
  'postCompanytype'(
    parameters?: Parameters<UnknownParamsObject> | null,
    data?: Paths.PostCompanytype.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PostCompanytype.Responses.$201>
  /**
   * getCompanytypeById - Get a certain companytype
   * 
   * GET request on a certain companytype by id {id}
   */
  'getCompanytypeById'(
    parameters?: Parameters<Paths.GetCompanytypeById.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.GetCompanytypeById.Responses.$200>
  /**
   * putCompanytypeById - Updates company type with id {id}
   * 
   * Put request on company type by id {id}
   */
  'putCompanytypeById'(
    parameters?: Parameters<Paths.PutCompanytypeById.HeaderParameters & Paths.PutCompanytypeById.PathParameters> | null,
    data?: Paths.PutCompanytypeById.RequestBody,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.PutCompanytypeById.Responses.$204>
  /**
   * deleteCompanytypeById - Remove a certain company type
   * 
   * DELETE request on company type by id {id}
   */
  'deleteCompanytypeById'(
    parameters?: Parameters<Paths.DeleteCompanytypeById.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig  
  ): OperationResponse<Paths.DeleteCompanytypeById.Responses.$204>
}

export interface PathsDictionary {
  ['/companies/']: {
    /**
     * getCompanies - Get a list of all companies
     * 
     * GET request on all companies
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetCompanies.Responses.$200>
    /**
     * postCompany - Create new company
     * 
     * POST request for a new company, response new id
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostCompany.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostCompany.Responses.$201>
  }
  ['/companies/{id}']: {
    /**
     * getCompanyById - Get a certain company
     * 
     * GET request on a certain company by id {id}
     */
    'get'(
      parameters?: Parameters<Paths.GetCompanyById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetCompanyById.Responses.$200>
    /**
     * putCompanyById - Updates company with id {id}
     * 
     * Put request on company by id {id}
     */
    'put'(
      parameters?: Parameters<Paths.PutCompanyById.HeaderParameters & Paths.PutCompanyById.PathParameters> | null,
      data?: Paths.PutCompanyById.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutCompanyById.Responses.$204>
    /**
     * deleteCompanyById - Remove a certain company
     * 
     * DELETE request on company by id {id}
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteCompanyById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteCompanyById.Responses.$204>
  }
  ['/companytypes/']: {
    /**
     * getCompanytypes - Get a list of all company types
     * 
     * GET request on all companies
     */
    'get'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetCompanytypes.Responses.$200>
    /**
     * postCompanytype - Add new company type
     * 
     * POST request for a new company type
     */
    'post'(
      parameters?: Parameters<UnknownParamsObject> | null,
      data?: Paths.PostCompanytype.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PostCompanytype.Responses.$201>
  }
  ['/companytypes/{id}']: {
    /**
     * getCompanytypeById - Get a certain companytype
     * 
     * GET request on a certain companytype by id {id}
     */
    'get'(
      parameters?: Parameters<Paths.GetCompanytypeById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.GetCompanytypeById.Responses.$200>
    /**
     * putCompanytypeById - Updates company type with id {id}
     * 
     * Put request on company type by id {id}
     */
    'put'(
      parameters?: Parameters<Paths.PutCompanytypeById.HeaderParameters & Paths.PutCompanytypeById.PathParameters> | null,
      data?: Paths.PutCompanytypeById.RequestBody,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.PutCompanytypeById.Responses.$204>
    /**
     * deleteCompanytypeById - Remove a certain company type
     * 
     * DELETE request on company type by id {id}
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteCompanytypeById.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig  
    ): OperationResponse<Paths.DeleteCompanytypeById.Responses.$204>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>

export type company = Components.Schemas.Company;
export type companytype = Components.Schemas.Companytype;
export type error = Components.Schemas.Error;
export type etag = Components.Schemas.Etag;
export type location = Components.Schemas.Location;
export type meta = Components.Schemas.Meta;
