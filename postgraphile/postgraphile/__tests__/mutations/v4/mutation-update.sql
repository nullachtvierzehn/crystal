update "c"."person" as __person__ set "person_full_name" = $1::"varchar", "about" = $2::"text" where (__person__."id" = $3::"int4") returning
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __person__."about" as "2",
  __person__::text as "3",
  __person__."id"::text as "4";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person_identifiers__.idx as "1"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"c"."person" as "id0", $2::"b"."email" as "id1") as __person_identifiers__,
lateral (
  select
    ("c"."person_exists"(
      __person__,
      __person_identifiers__."id1"
    ))::text as "0",
    __person__."id"::text as "1",
    __person_identifiers__.idx as "2"
  from (select (__person_identifiers__."id0").*) as __person__
) as __person_result__;

update "c"."person" as __person__ set "person_full_name" = $1::"varchar", "email" = $2::"b"."email" where (__person__."id" = $3::"int4") returning
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __person__."about" as "2",
  __person__::text as "3",
  __person__."id"::text as "4";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person_identifiers__.idx as "1"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"c"."person" as "id0", $2::"b"."email" as "id1") as __person_identifiers__,
lateral (
  select
    ("c"."person_exists"(
      __person__,
      __person_identifiers__."id1"
    ))::text as "0",
    __person__."id"::text as "1",
    __person_identifiers__.idx as "2"
  from (select (__person_identifiers__."id0").*) as __person__
) as __person_result__;

update "c"."person" as __person__ set "about" = $1::"text" where (__person__."id" = $2::"int4") returning
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __person__."about" as "2",
  __person__::text as "3",
  __person__."id"::text as "4";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person_identifiers__.idx as "1"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"c"."person" as "id0", $2::"b"."email" as "id1") as __person_identifiers__,
lateral (
  select
    ("c"."person_exists"(
      __person__,
      __person_identifiers__."id1"
    ))::text as "0",
    __person__."id"::text as "1",
    __person_identifiers__.idx as "2"
  from (select (__person_identifiers__."id0").*) as __person__
) as __person_result__;

update "c"."person" as __person__ set "about" = $1::"text" where (__person__."id" = $2::"int4") returning
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __person__."about" as "2",
  __person__::text as "3",
  __person__."id"::text as "4";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person_identifiers__.idx as "1"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"c"."person" as "id0", $2::"b"."email" as "id1") as __person_identifiers__,
lateral (
  select
    ("c"."person_exists"(
      __person__,
      __person_identifiers__."id1"
    ))::text as "0",
    __person__."id"::text as "1",
    __person_identifiers__.idx as "2"
  from (select (__person_identifiers__."id0").*) as __person__
) as __person_result__;

update "c"."person" as __person__ set "person_full_name" = $1::"varchar", "about" = $2::"text" where (__person__."id" = $3::"int4") returning
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __person__."about" as "2",
  __person__::text as "3",
  __person__."id"::text as "4";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person_identifiers__.idx as "1"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"c"."person" as "id0", $2::"b"."email" as "id1") as __person_identifiers__,
lateral (
  select
    ("c"."person_exists"(
      __person__,
      __person_identifiers__."id1"
    ))::text as "0",
    __person__."id"::text as "1",
    __person_identifiers__.idx as "2"
  from (select (__person_identifiers__."id0").*) as __person__
) as __person_result__;

update "c"."person" as __person__ set "about" = $1::"text" where (__person__."email" = $2::"b"."email") returning
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __person__."about" as "2",
  __person__::text as "3",
  __person__."id"::text as "4";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person_identifiers__.idx as "1"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"c"."person" as "id0", $2::"b"."email" as "id1") as __person_identifiers__,
lateral (
  select
    ("c"."person_exists"(
      __person__,
      __person_identifiers__."id1"
    ))::text as "0",
    __person__."id"::text as "1",
    __person_identifiers__.idx as "2"
  from (select (__person_identifiers__."id0").*) as __person__
) as __person_result__;

update "c"."compound_key" as __compound_key__ set "person_id_1" = $1::"int4", "extra" = $2::"bool" where ((__compound_key__."person_id_1" = $3::"int4") and (__compound_key__."person_id_2" = $4::"int4")) returning
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1",
  __compound_key__."extra"::text as "2";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

update "c"."compound_key" as __compound_key__ set "person_id_1" = $1::"int4", "extra" = $2::"bool" where ((__compound_key__."person_id_1" = $3::"int4") and (__compound_key__."person_id_2" = $4::"int4")) returning
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1",
  __compound_key__."extra"::text as "2";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

update "c"."compound_key" as __compound_key__ set "extra" = $1::"bool" where ((__compound_key__."person_id_1" = $2::"int4") and (__compound_key__."person_id_2" = $3::"int4")) returning
  __compound_key__."person_id_1"::text as "0",
  __compound_key__."person_id_2"::text as "1",
  __compound_key__."extra"::text as "2";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person__."person_full_name" as "1",
    __person_identifiers__.idx as "2"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
) as __person_result__;

update "c"."person" as __person__ set "email" = $1::"b"."email" where (__person__."email" = $2::"b"."email") returning
  __person__."person_full_name" as "0",
  __person__."email" as "1",
  __person__."about" as "2",
  __person__::text as "3",
  __person__."id"::text as "4";

select __person_result__.*
from (select 0 as idx, $1::"int4" as "id0") as __person_identifiers__,
lateral (
  select
    __person__."id"::text as "0",
    __person_identifiers__.idx as "1"
  from "c"."person" as __person__
  where (
    __person__."id" = __person_identifiers__."id0"
  )
  order by __person__."id" asc
) as __person_result__;

select __person_result__.*
from (select 0 as idx, $1::"c"."person" as "id0", $2::"b"."email" as "id1") as __person_identifiers__,
lateral (
  select
    ("c"."person_exists"(
      __person__,
      __person_identifiers__."id1"
    ))::text as "0",
    __person__."id"::text as "1",
    __person_identifiers__.idx as "2"
  from (select (__person_identifiers__."id0").*) as __person__
) as __person_result__;

update "a"."default_value" as __default_value__ set "null_value" = $1::"text" where (__default_value__."id" = $2::"int4") returning
  __default_value__."id"::text as "0",
  __default_value__."null_value" as "1";

update "a"."no_primary_key" as __no_primary_key__ set "str" = $1::"text" where (__no_primary_key__."id" = $2::"int4") returning
  __no_primary_key__."id"::text as "0",
  __no_primary_key__."str" as "1";