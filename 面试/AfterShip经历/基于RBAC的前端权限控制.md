## RBAC 简介
RBAC（Role-Based Access Control）即：基于角色的访问控制。RBAC 认为授权其实就是 who, what, how 三者之间的关系，即 who 对 what 进行 how 操作。简单来说就是某个角色 (who) 对某些资源 (what) 拥有怎样的 (how) 权限。

在 RBAC 中，用户只和角色关联，而角色对应了一组权限。通过为不同的用户分配不同的角色，从而让不同的用户拥有不同的权限。

相比于 ACL（Access Control List）直接为用户赋予权限的方式，RBAC 通过角色为用户和权限之间架起了一座桥梁，从而简化了用户和权限之间的关系，让权限配置更易于扩展和维护。