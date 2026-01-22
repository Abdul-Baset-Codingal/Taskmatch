// types/admin.ts
export interface Quote {
    _id: string;
    taskTitle: string;
    taskDescription: string;
    location: string;
    status: QuoteStatus;
    budget?: number;
    urgency: string;
    preferredDateTime?: string;
    client: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        profilePicture?: string;
    };
    tasker: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        phone?: string;
        profilePicture?: string;
        stripeConnectStatus?: string;
    };
    bids: Bid[];
    acceptedBid?: {
        bidId: string;
        tasker: string;
        bidAmount: number;
        bidDescription: string;
        estimatedDuration: number;
        acceptedAt: string;
    };
    payment?: Payment;
    createdAt: string;
    updatedAt: string;
    acceptedAt?: string;
    startedAt?: string;
    completedAt?: string;
    cancelledAt?: string;
    cancellationReason?: string;
}

export type QuoteStatus =
    | 'pending'
    | 'bidded'
    | 'accepted'
    | 'in_progress'
    | 'completed'
    | 'rejected'
    | 'cancelled'
    | 'expired';

export type PaymentStatus =
    | 'pending'
    | 'held'
    | 'authorized'
    | 'captured'
    | 'released'
    | 'refunded'
    | 'partial_refund'
    | 'failed'
    | 'cancelled';

export interface Bid {
    _id: string;
    tasker: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    bidAmount: number;
    bidDescription: string;
    estimatedDuration: number;
    status: 'pending' | 'accepted' | 'rejected' | 'expired' | 'withdrawn';
    submittedAt: string;
    feeBreakdown?: FeeBreakdown;
}

export interface FeeBreakdown {
    bidAmountCents: number;
    clientPlatformFeeCents: number;
    reservationFeeCents: number;
    clientTaxCents: number;
    totalClientPaysCents: number;
    taskerPlatformFeeCents: number;
    taskerTaxCents: number;
    taskerPayoutCents: number;
    applicationFeeCents: number;
}

export interface Payment {
    paymentIntentId?: string;
    status: PaymentStatus;
    feeStructure: string;
    bidAmount: number;
    bidAmountCents: number;
    clientPlatformFee: number;
    reservationFee: number;
    clientTax: number;
    totalClientPays: number;
    totalClientPaysCents: number;
    taskerPlatformFee: number;
    taskerTax: number;
    taskerPayout: number;
    taskerPayoutCents: number;
    applicationFee: number;
    applicationFeeCents: number;
    currency: string;
    authorizedAt?: string;
    capturedAt?: string;
    refundedAt?: string;
    refundAmount?: number;
    refundReason?: string;
}

export interface QuoteStatistics {
    overview: {
        totalQuotes: number;
        statusBreakdown: Record<string, number>;
        paymentStatusBreakdown: Record<string, number>;
    };
    conversions: {
        acceptanceRate: string;
        completionRate: string;
        cancellationRate: string;
    };
    revenue: {
        totalBidAmount: number;
        totalClientPaid: number;
        totalTaskerPayout: number;
        totalPlatformFee: number;
        totalReservationFees: number;
        totalClientTax: number;
        totalTaskerTax: number;
        transactionCount: number;
    };
    heldPayments: {
        totalHeldAmount: number;
        count: number;
    };
    quotesPerDay: Array<{
        _id: string;
        count: number;
        totalBidAmount: number;
    }>;
    topTaskers: TopPerformer[];
    topClients: TopPerformer[];
}

export interface TopPerformer {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    completedCount?: number;
    totalEarnings?: number;
    quoteCount?: number;
    totalSpent?: number;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface AdminAction {
    _id: string;
    action: string;
    previousStatus?: string;
    newStatus?: string;
    amount?: number;
    reason?: string;
    adminId: string;
    admin?: {
        firstName: string;
        lastName: string;
        email: string;
    };
    timestamp: string;
}

export interface Dispute {
    _id: string;
    taskTitle: string;
    status: string;
    client: { firstName: string; lastName: string; email: string };
    tasker: { firstName: string; lastName: string; email: string };
    payment?: Payment;
    issue: {
        type: string;
        description: string;
    };
    createdAt: string;
}