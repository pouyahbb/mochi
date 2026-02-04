export interface PolarWebhookEvent<TData = unknown> {
    id : string | number;
    type : string ;
    data : TData
}

export const isPolarWebhookEvent=  (
    x : unknown
) : x is PolarWebhookEvent<unknown> => {
    return (
        !!x && 
        typeof x === "object" && 
        'type' in (x as Record<string, unknown>) && 
        'data' in (x as Record<string , unknown>)
    )
}


export type ReceivedEvent = PolarWebhookEvent<unknown>

export interface PolarCustomer {
    id : string
    email: string | null
}

export interface PolarPrice {
    id?: string | null
    recurring_interval?: string | null
}

export interface PolarProduct{
    id?: string | null
    name?: string | null
}

export interface PolarSubscription {
    id : string
    status : string
    current_period_end?: string | null
    trial_ends_at?: string | null
    cancel_at?:string | null
    canceled_at?: string | null
    customer?:PolarCustomer | null
    customer_id?: string | null
    product_id?: string | null
    product?: PolarProduct | null
    prices?: PolarPrice[] | null
    seats?: number | null
    plan_code?: string | null
    metadata?: Record<string,unknown> | null
}

export const extractSubscriptionLike = (
    data : unknown
) : PolarSubscription | null => {
    if(data && typeof data === "object"){
        const d = data as Record<string, unknown>
        const sub = (d.subscription && typeof d.subscription === "object" ? (d.subscription as Record<string, unknown>) : d) as Record<string, unknown>
        const id = sub.id
        const status = sub.status
        if(typeof id === "string" && typeof status === "string"){
            return {
                id ,
                status ,
                current_period_end : sub.current_period_end as string | undefined | null,
                trial_ends_at : sub.trial_ends_at as string | undefined | null,
                cancel_at : sub.cancel_at as string | undefined | null,
                canceled_at : sub.canceled_at as string | undefined | null,
                customer : sub.customer as PolarCustomer | undefined | null,
                customer_id : sub.customer_id as string | undefined | null,
                product_id : sub.product_id as string | undefined | null,
                product : sub.product as PolarProduct | undefined | null,
                prices : sub.prices as PolarPrice[] | undefined | null,
                seats  : (typeof sub.seats === "number" ? sub.seats : undefined) ?? null,
                plan_code : sub.plan_code as string | undefined | null,
                metadata : (sub.metadata as Record<string, unknown> | undefined) ?? null
            }
        }
    }
    return null
}

export interface PolarOrder {
    id : string
    billing_reason?: string | null 
    subscription_id?: string | null
    customer?:PolarCustomer | null
    customer_id?: string | null
    metadata?: Record<string, unknown> | null
}

export const extractOrderLike = (data : unknown) : PolarOrder | null => {
    if(!data || typeof data !== "object") return null
    const d = data as Record<string , unknown>
    const id = d.id
    if(typeof id !== "string") return null
    return {
        id ,
        billing_reason : d.billing_reason as string | undefined | null,
        subscription_id : d.subscription_id as string | undefined | null,
        customer : d.customer as PolarCustomer | undefined | null,
        customer_id : d.customer_id as string | undefined | null,
        metadata : (d.metadata as Record<string , unknown> | undefined) ?? null
    }
}

export const toMs = (x : string | number | null | undefined) : number | undefined => {
    if(x == null) return undefined
    if(typeof x === "number") return x 
    const t = Date.parse(x)
    return Number.isNaN(t) ? undefined : t
}

export const isEntitledStatus = (status : string) : boolean => {
    // Include 'paid' for one-time purchases
    return /^(active|trialing|paid)$/i.test(status)
}

// Extract customer data from various Polar event formats
export interface PolarCustomerData {
    id: string
    email: string | null
    metadata?: Record<string, unknown> | null
    activeSubscriptions?: Array<{
        id?: string
        status?: string
        productId?: string
        priceId?: string
        currentPeriodEnd?: string | null
    }> | null
}

export const extractCustomerLike = (data: unknown): PolarCustomerData | null => {
    if (!data || typeof data !== "object") return null
    const d = data as Record<string, unknown>
    
    // Check if this is a customer object directly
    const id = d.id as string | undefined
    const email = d.email as string | undefined
    
    if (typeof id === "string" && typeof email === "string") {
        return {
            id,
            email,
            metadata: d.metadata as Record<string, unknown> | undefined ?? null,
            activeSubscriptions: d.activeSubscriptions as PolarCustomerData["activeSubscriptions"] ?? null
        }
    }
    
    // Check nested customer
    if (d.customer && typeof d.customer === "object") {
        const customer = d.customer as Record<string, unknown>
        const custId = customer.id as string | undefined
        const custEmail = customer.email as string | undefined
        if (typeof custId === "string") {
            return {
                id: custId,
                email: custEmail ?? null,
                metadata: customer.metadata as Record<string, unknown> | undefined ?? null,
                activeSubscriptions: null
            }
        }
    }
    
    return null
}

// Extract email from any Polar event data
export const extractEmailFromEvent = (data: unknown): string | null => {
    if (!data || typeof data !== "object") return null
    const d = data as Record<string, unknown>
    
    // Direct email field
    if (typeof d.email === "string") return d.email
    
    // Customer.email
    if (d.customer && typeof d.customer === "object") {
        const customer = d.customer as Record<string, unknown>
        if (typeof customer.email === "string") return customer.email
    }
    
    // Subscription.customer.email
    if (d.subscription && typeof d.subscription === "object") {
        const sub = d.subscription as Record<string, unknown>
        if (sub.customer && typeof sub.customer === "object") {
            const customer = sub.customer as Record<string, unknown>
            if (typeof customer.email === "string") return customer.email
        }
    }
    
    // User.email
    if (d.user && typeof d.user === "object") {
        const user = d.user as Record<string, unknown>
        if (typeof user.email === "string") return user.email
    }
    
    return null
}

// Extract userId from metadata in any Polar event
export const extractUserIdFromMetadata = (data: unknown): string | null => {
    if (!data || typeof data !== "object") return null
    const d = data as Record<string, unknown>
    
    // Direct metadata.userId
    if (d.metadata && typeof d.metadata === "object") {
        const meta = d.metadata as Record<string, unknown>
        if (typeof meta.userId === "string") return meta.userId
    }
    
    // Subscription.metadata.userId
    if (d.subscription && typeof d.subscription === "object") {
        const sub = d.subscription as Record<string, unknown>
        if (sub.metadata && typeof sub.metadata === "object") {
            const meta = sub.metadata as Record<string, unknown>
            if (typeof meta.userId === "string") return meta.userId
        }
    }
    
    // Customer.metadata.userId
    if (d.customer && typeof d.customer === "object") {
        const customer = d.customer as Record<string, unknown>
        if (customer.metadata && typeof customer.metadata === "object") {
            const meta = customer.metadata as Record<string, unknown>
            if (typeof meta.userId === "string") return meta.userId
        }
    }
    
    return null
}