package h2runner;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Map;

import org.h2.jdbcx.JdbcDataSource;
import org.h2.tools.Server;

public class H2Runner {
	public static void main(String[] args) {
		Map<String, String> env = System.getenv();
		String url = env.get("H2RUN");
		if (url == null) {
			System.err.println("H2RUN undefined.");
			return;
		}
		String usr = env.get("H2USR");
		if (usr == null) {
			System.err.println("H2USR undefined.");
			return;
		}
		String pwd = env.get("H2PWD");
		if (pwd == null) {
			System.err.println("H2PWD undefined.");
			return;
		}

		String tcpPort = env.getOrDefault("TCPPORT", "9092");
		String pgPort = env.getOrDefault("PGPORT", "5435");
		String webPort = env.getOrDefault("WEBPORT", "8082");

		Connection connection = null;
		Statement statement = null;
		Server tcpServer = null;
		Server pgServer = null;
		Server webServer = null;
		try {
			JdbcDataSource ds = new JdbcDataSource();
			ds.setURL(url);
			ds.setUser(usr);
			ds.setPassword(pwd);

			connection = ds.getConnection();
			connection.close();
			System.out.println("RUN URL: " + url);

			tcpServer = Server.createTcpServer("-tcpPort", tcpPort).start();
			System.out.println("tcp server [port: " + tcpPort + "]");

			pgServer = Server.createPgServer("-tcpPort", pgPort).start();
			System.out.println("postgreSQL(ODBC) server [port: " + pgPort + "]");

			webServer = Server.createWebServer("-tcpPort", webPort).start();
			System.out.println("web server [port: " + webPort + "]");

			System.out.print("Press enter key to exit.");
			System.in.read();

			connection = ds.getConnection();
			statement = connection.createStatement();
			statement.execute("SHUTDOWN");
			statement.close();
			connection.close();
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (statement != null && !statement.isClosed()) {
					statement.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
			try {
				if (connection != null && !connection.isClosed()) {
					connection.close();
				}
			} catch (SQLException e) {
				e.printStackTrace();
			}
			if (tcpServer != null && tcpServer.isRunning(false)) {
				tcpServer.stop();
			}
			if (pgServer != null && pgServer.isRunning(false)) {
				pgServer.stop();
			}
			if (webServer != null && webServer.isRunning(false)) {
				webServer.stop();
			}
			System.out.print("exit!");
		}
	}
}
