# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import genlayer.gl as gl

STATUS_ACTIVE = "ACTIVE"
STATUS_SUBMITTED = "SUBMITTED"
STATUS_RESOLVING = "RESOLVING"
STATUS_SETTLED = "SETTLED"
STATUS_REJECTED = "REJECTED"


class AegisBounty(gl.Contract):
    protocol_admin: Address
    protocol_name: str
    security_charter: str
    bounty_pool: u256
    status: str
    critical_bps: u256
    high_bps: u256
    medium_bps: u256
    reports_count: u256

    def __init__(self, protocol_name: str, security_charter: str, critical_bps: u256, high_bps: u256, medium_bps: u256):
        self.protocol_admin = gl.message.sender_address
        self.protocol_name = str(protocol_name)
        self.security_charter = str(security_charter)
        self.bounty_pool = u256(0)
        self.status = STATUS_ACTIVE
        self.critical_bps = critical_bps
        self.high_bps = high_bps
        self.medium_bps = medium_bps
        self.reports_count = u256(0)
