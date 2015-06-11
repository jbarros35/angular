package com.businessdata.config;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Properties;

import javax.sql.DataSource;

import org.apache.commons.dbcp.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.JpaVendorAdapter;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.Database;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.stereotype.Controller;

import com.businessdata.model.BlogNews;

@Configuration
@EnableJpaRepositories(basePackages = { "com.businessdata.repository" })
@ComponentScan(basePackages = "com.businessdata", excludeFilters = {
    @ComponentScan.Filter(value = Controller.class, type = FilterType.ANNOTATION),
    @ComponentScan.Filter(value = Configuration.class, type = FilterType.ANNOTATION)
})
public class AppConfig extends RepositoryRestMvcConfiguration {

  private static final String PACKAGES_SCAN = "com.businessdata";

@Override
  protected void configureRepositoryRestConfiguration(RepositoryRestConfiguration config) {
    super.configureRepositoryRestConfiguration(config);
    try {
      config.setBaseUri(new URI("/api"));
      config.exposeIdsFor(BlogNews.class);
    } catch (URISyntaxException e) {
      e.printStackTrace();
    }
  }
/*
  @Bean
  public DataSource dataSource() {
    return new EmbeddedDatabaseBuilder().setType(EmbeddedDatabaseType.HSQL).build();
  }*/

  @Bean(destroyMethod = "close")
  public DataSource dataSource() {
      BasicDataSource dataSource = new BasicDataSource();
      dataSource.setDriverClassName("org.postgresql.Driver");
      String url = "jdbc:postgresql://" +
    		  System.getenv("POSTGRESQL_DB_HOST") + ":"
              + System.getenv("POSTGRESQL_DB_PORT")
              + "/"+System.getenv("APP_NAME");
      System.out.println(url);
      dataSource.setUrl("jdbc:postgresql://localhost:5432/test");
      //dataSource.setUsername(System.getenv("POSTGRESQL_DB_USERNAME"));
      //dataSource.setPassword(System.getenv("POSTGRESQL_DB_PASSWORD"));
      dataSource.setUsername("postgres");
      dataSource.setPassword("123456");
      dataSource.setTestOnBorrow(true);
      dataSource.setTestOnReturn(true);
      dataSource.setTestWhileIdle(true);
      dataSource.setTimeBetweenEvictionRunsMillis(1800000L);
      dataSource.setNumTestsPerEvictionRun(3);
      dataSource.setMinEvictableIdleTimeMillis(1800000L);
      dataSource.setValidationQuery("SELECT 1");
      return dataSource;
  }
  @Bean
  public JpaVendorAdapter jpaVendorAdapter() {
    HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
    adapter.setShowSql(true);
    adapter.setGenerateDdl(true);
    //adapter.setDatabase(Database.HSQL);
    adapter.setDatabase(Database.POSTGRESQL);
    return adapter;
  }

  @Bean
  public LocalContainerEntityManagerFactoryBean entityManagerFactory() throws ClassNotFoundException {
   /* h2 setup
    *  LocalContainerEntityManagerFactoryBean factoryBean = new LocalContainerEntityManagerFactoryBean();
    factoryBean.setDataSource(dataSource());
    factoryBean.setPackagesToScan("be.g00glen00b.model");
    factoryBean.setJpaVendorAdapter(jpaVendorAdapter());
    factoryBean.setJpaProperties(jpaProperties());

    return factoryBean;*/
	  // postgres setup
	  HibernateJpaVendorAdapter vendorAdapter = new HibernateJpaVendorAdapter();
      vendorAdapter.setDatabase(Database.POSTGRESQL);
      vendorAdapter.setGenerateDdl(true);
      vendorAdapter.setShowSql(true);

      LocalContainerEntityManagerFactoryBean factory = new LocalContainerEntityManagerFactoryBean();
      factory.setJpaVendorAdapter(vendorAdapter);
      factory.setPackagesToScan(PACKAGES_SCAN);
      factory.setDataSource(dataSource());
      return factory;
  }

  @Bean
  public JpaTransactionManager transactionManager() throws ClassNotFoundException {
    JpaTransactionManager transactionManager = new JpaTransactionManager();
    transactionManager.setEntityManagerFactory(entityManagerFactory().getObject());

    return transactionManager;
  }
/*
  @Bean
  public Properties jpaProperties() {
    Properties properties = new Properties();
    properties.put(HBM2DDL_AUTO, "create-drop");
    return properties;
  }*/


}
