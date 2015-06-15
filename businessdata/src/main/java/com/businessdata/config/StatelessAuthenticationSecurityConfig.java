package com.businessdata.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CsrfFilter;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;

import com.businessdata.security.TokenAuthenticationService;
import com.businessdata.security.UserDetailsService;

@Configuration
@EnableWebSecurity
//@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
public class StatelessAuthenticationSecurityConfig extends
		WebSecurityConfigurerAdapter {

	@Autowired
	private UserDetailsService userDetailsService;

	@Autowired
	private TokenAuthenticationService tokenAuthenticationService;

	public StatelessAuthenticationSecurityConfig() {
		super(true);
	}

	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth)
			throws Exception {

		DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
		daoAuthenticationProvider.setUserDetailsService(userDetailsService);

		auth.authenticationProvider(daoAuthenticationProvider);
	}

	/*
	 * @Override public void configure(WebSecurity webSecurity) throws Exception
	 * { webSecurity.ignoring() // All of Spring Security will ignore the
	 * requests .antMatchers("/resources/**") .antMatchers(HttpMethod.POST,
	 * "/api/login"); }
	 */

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		/*
		 * http.exceptionHandling().and().anonymous().and() .servletApi() .and()
		 * .headers() .cacheControl() .and() .authorizeRequests()
		 * 
		 * // allow anonymous resource requests .antMatchers("/") .permitAll()
		 * .antMatchers("/favicon.ico") .permitAll()
		 * .antMatchers("/resources/**") .permitAll()
		 * 
		 * // allow anonymous POSTs to login .antMatchers(HttpMethod.POST,
		 * "/api/login") .permitAll()
		 * 
		 * // allow anonymous GETs to API // .antMatchers(HttpMethod.GET,
		 * "/api/**").permitAll()
		 * 
		 * // defined Admin only API area .antMatchers("/admin/**")
		 * .hasRole("ADMIN")
		 * 
		 * // all other request need to be authenticated .anyRequest()
		 * .hasRole("USER") .and()
		 * 
		 * // custom JSON based authentication by POST of //
		 * {"username":"<name>","password":"<password>"} which sets the // token
		 * header upon authentication .addFilterBefore( new
		 * StatelessLoginFilter("/api/login", tokenAuthenticationService,
		 * userDetailsService, authenticationManager()),
		 * UsernamePasswordAuthenticationFilter.class)
		 * 
		 * // custom Token based authentication based on the header //
		 * previously given to the client .addFilterBefore( new
		 * StatelessAuthenticationFilter( tokenAuthenticationService),
		 * UsernamePasswordAuthenticationFilter.class); http.httpBasic();
		 * http.sessionManagement().sessionCreationPolicy(
		 * SessionCreationPolicy.STATELESS);
		 */

		http.httpBasic().and().authorizeRequests()
				.antMatchers("/index.html", "/home.html", "/login.html", "/")
				.permitAll().anyRequest().authenticated().and()
				.addFilterAfter(new CsrfHeaderFilter(), CsrfFilter.class)
				.csrf().csrfTokenRepository(csrfTokenRepository());
	}

	private CsrfTokenRepository csrfTokenRepository() {
		HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
		repository.setHeaderName("X-XSRF-TOKEN");
		return repository;
	}

	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	protected void configure(AuthenticationManagerBuilder auth)
			throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(
				new BCryptPasswordEncoder());
	}

	@Override
	protected UserDetailsService userDetailsService() {
		return userDetailsService;
	}
}
