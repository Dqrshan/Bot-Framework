import { GuildMember, PermissionResolvable, TextChannel } from 'discord.js';

export const doPermissionCheck = (
    channel: TextChannel,
    member: GuildMember,
    permission: PermissionResolvable
): boolean => {
    if (channel.permissionsFor(member!).has(permission)) return true;
    if (member!.permissions.has(permission)) return true;
    return false;
};
