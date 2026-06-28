console.log("APP STARTED");

const client = supabase.createClient(
  "https://rseucqlzkmbfaiiwhjws.supabase.co",
  "sb_publishable_pkY5M1d6GlM0qp8b6yJH5g_vfW-REtf"
);

let username = prompt("Enter your name:");
document.getElementById("playerName").innerText = username;

let score = 0;

// click tăng điểm
document.getElementById("clickBtn").addEventListener("click", async () => {
  score++;
  document.getElementById("score").innerText = score;

  await client
    .from("scores")
    .upsert({ username: username, score: score });

  loadLeaderboard();
});

// load leaderboard
async function loadLeaderboard() {
  let { data, error } = await client
    .from("scores")
    .select("*")
    .order("score", { ascending: false });

  console.log("DATA:", data);
  console.log("ERROR:", error);

  document.getElementById("leaderboard").innerHTML =
    (data || []).map((p, i) =>
      `${i + 1}. ${p.username} - ${p.score}`
    ).join("<br>");
}

// realtime
client
  .channel("scores")
  .on("postgres_changes", {
    event: "*",
    schema: "public",
    table: "scores"
  }, () => {
    loadLeaderboard();
  })
  .subscribe();

// init
loadLeaderboard();