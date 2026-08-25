# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
import genlayer.gl as gl


def _to_address(val) -> Address:
    """Safely coerces Address, string, or hex int into a valid GenLayer Address object."""
    if isinstance(val, Address):
        return val
    if isinstance(val, str):
        return Address(val)
    if isinstance(val, int):
        hex_str = hex(val)
        hex_body = hex_str[2:].rjust(40, "0")
        return Address("0x" + hex_body)
    return Address(str(val))


class AegisBountyFactory(gl.Contract):
    """
    Registry & Factory for indexing all deployed protocol bug bounty vaults.
    """
    vaults: DynArray[Address]
    owner: Address

    def __init__(self):
        self.owner = gl.message.sender_address
        # GenVM automatically initializes self.vaults in storage

    @gl.public.write
    def register_vault(self, vault_address: Address) -> None:
        """Register a newly deployed bounty vault address."""
        self.vaults.append(_to_address(vault_address))

    @gl.public.view
    def get_all_vaults(self) -> list:
        """Return all registered bounty vault addresses as hex strings."""
        result = []
        for i in range(len(self.vaults)):
            result.append(self.vaults[i].as_hex)
        return result

    @gl.public.view
    def get_vault_count(self) -> int:
        """Return total number of registered protocol vaults."""
        return len(self.vaults)
