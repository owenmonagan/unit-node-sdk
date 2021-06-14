import { CreateDebitCardRequest, DebitCard, PatchAccountRequest } from "../types/cards";
import { UnitResponse, UnitError, Include } from "../types/core";
import { Customer } from "../types/customer";
import { DepositAccount } from "../types/depositAccount";
import { BaseResource } from "./baseResource";

export class Cards extends BaseResource {

    constructor(token: string, basePath: string) {
        super(token, basePath + '/cards');
    }

    public async createDebitCard(request: CreateDebitCardRequest): Promise<UnitResponse<DebitCard> | UnitError> {
        return await this.httpPost<UnitResponse<DebitCard>>('', { data: request })
    }

    public async reportStolen(id: number): Promise<UnitResponse<DebitCard> | UnitError> {
        const path = `/${id}/report-stolen`
        return await this.httpPost<UnitResponse<DebitCard>>(path)
    }

    public async reportLost(id: number): Promise<UnitResponse<DebitCard> | UnitError> {
        const path = `/${id}/report-lost`
        return await this.httpPost<UnitResponse<DebitCard>>(path)
    }

    public async closeCard(id: number): Promise<UnitResponse<DebitCard> | UnitError> {
        const path = `/${id}/close`
        return await this.httpPost<UnitResponse<DebitCard>>(path)
    }

    public async freeze(id: number): Promise<UnitResponse<DebitCard> | UnitError> {
        const path = `/${id}/freeze`
        return await this.httpPost<UnitResponse<DebitCard>>(path)
    }

    public async unfreeze(id: number): Promise<UnitResponse<DebitCard> | UnitError> {
        const path = `/${id}/unfreeze`
        return await this.httpPost<UnitResponse<DebitCard>>(path)
    }

    public async replace(request: PatchAccountRequest): Promise<UnitResponse<DebitCard> | UnitError> {
        const path = `/${request.id}`
        const data = {
            type: request.type,
            attributes: {
                shippingAddress: request.shippingAddress
            }
        }
        
        return await this.httpPatch<UnitResponse<DebitCard>>(path, { data })
    }

    /**
     * @param id 
     * @param include - Optional. A comma-separated list of related resources to include in the response.
     * Related resources include: customer, account. See [Getting Related Resources](https://developers.unit.co/#intro-getting-related-resources).
     */
    public async get(id: number, include: string = ''): Promise<UnitResponse<DebitCard> | UnitError> {
        const path = `/${id}?include=${include}`

        return await this.httpGet<UnitResponse<DebitCard> & Include<DepositAccount[] | Customer[]>>(path)
    }

    public async list(params?: CardListParams): Promise<UnitResponse<DebitCard> & Include<DepositAccount[] | Customer[]> | UnitError> {
        var parameters = {
            'page[limit]': (params?.limit ? params?.limit : 100),
            'page[offset]': (params?.offset ? params?.offset : 0),
            ...(params?.accountId && { 'filter[accountId]': params?.accountId }),
            ...(params?.customerId && { 'filter[customerId]': params?.customerId }),
            ...(params?.include && { 'include': params?.include })
        }

        return this.httpGet<UnitResponse<DebitCard> & Include<DepositAccount[] | Customer[]>>('', { params: parameters })
    }
}

interface CardListParams {
    /**
     * Maximum number of resources that will be returned. Maximum is 1000 resources. See Pagination.
     * default: 100
     */
    limit?: number,

    /**
     * Number of resources to skip. See Pagination.
     * default: 0
     */
    offset?: number,

    /**
     * Optional. Filters the results by the specified account id.
     * default: empty
     */
    accountId?: string,

    /**
     * Optional. Filters the results by the specified customer id.
     * default: empty
     */
    customerId?: string,

    /**
     * Optional. A comma-separated list of related resources to include in the response. Related resources include: customer, account. See Getting Related Resources
     * default: empty
     */
    include?: string
}

