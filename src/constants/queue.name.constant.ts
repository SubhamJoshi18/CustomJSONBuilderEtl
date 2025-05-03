export const QUEUE_NAMES = {
  json_extractor_queue_name: "CSBEtl: Extractor-JSON-Consumer",
} as const;

export const EXCHANGE_TYPES = {
  direct_exchange: "direct",
} as const;

export const EXCHANGE_NAMES = {
  extractor_exchange: "extractor_exchange",
};

export const ROUTING_KEYS = {
  extractor_routing_key: "extractor-routing-key",
};
