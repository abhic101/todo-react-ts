const ErrorKindName = {
    unreachable: "UNREACHABLE",
    timeout: 'REQ_TIMEOUT',
    aborted: 'REQ_ABORTED',
    http: 'HTTP',
    parse: 'RES_PARSE',
    unknown: 'UNKNOWN'
}

const StatusCodeMap = {
    unreachable: 604,
    timeout: 605,
    aborted: 606,
    parse: 609,
    unknown: 600
}

export {
    ErrorKindName,
    StatusCodeMap
}